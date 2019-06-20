// Importing the express library
const express = require("express");
const app = express();

// Importing our blockchain contrunctor
const Blockchain = require("./blockchain");

// Initializing our blockchain on the server
let bitcoin = new Blockchain();

// Specifying the port number on which server runs
// args just specify the argument we pas in package.json file
// while starting the server
const port = process.argv[2];

// Getting uuid library to generate random address for network node
const uuid = require("uuid/v1");

const nodeAddress = uuid()
  .split("-")
  .join("");

// Library to send requests
const axios = require("axios");

// Allowing crose origin requests
var cors = require("cors");

// Adding body parser as a middlewear to
// all the requests send to server
// Its makes extracting the data from the request easy
var bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// parse application/json
app.use(bodyParser.json());

// Initializing cors
app.use(cors());

// Sending back our complete blockchain to the client
app.get("/blockchain", (req, res) => res.send(bitcoin));

// We will get the amount, sender and the recipient from the client
// we wil add the create the new transaction and send back the
// index on which that transaction will be added after proof of work
app.post("/transaction", (req, res) => {
  // Extracting newTransaction from the request
  const newTransaction = req.body.newTransaction;

  // Getting the transaction index number
  const blockIndex = bitcoin.addTransactionToPendingTransactions(
    newTransaction
  );

  // Sending back transaction index to the client
  res.json({
    note: `Transaction will be added in block ${blockIndex}.`
  });
});

app.post("/transaction/broadcast", (req, res) => {
  // Extracting amount from the request
  let amount = req.body.amount,
    // Extracting sender and recipient
    sender = req.body.sender,
    recipient = req.body.recipient,
    // Geting all network nodes for broadcasting transaction
    allNetworkNodes = bitcoin.networkNodes;

  // Getting the transaction index number
  const newTransaction = bitcoin.createNewTransaction(
    amount,
    sender,
    recipient
  );

  bitcoin.addTransactionToPendingTransactions(newTransaction);
  // Broadcasting our transaction to the all other network nodes
  let regTransactionPromises = [];

  //Registering the new node with already present nodes
  allNetworkNodes.forEach(networkNodeUrl => {
    //Sending promise request to each networkUrl seperatly
    const newRegisterPromiseRequest = axios.post(
      `${networkNodeUrl}/transaction`,
      {
        newTransaction
      }
    );

    // Pushing the promise to the promises array
    regTransactionPromises.push(newRegisterPromiseRequest);
  });

  // Executing all the promises
  Promise.all(regTransactionPromises).then(data => {
    // Sending back transaction index to the client
    res.json({
      note: `Transaction is broadcasted to all network nodes successfully.`
    });
  });
});

// Adding route so we can mine the pending transactions
app.get("/mine", (req, res) => {
  // Getting last block of the blockchain
  const lastBlock = bitcoin.getLastBlock();

  // Getting hash of the last block
  const prevBlockHash = lastBlock["hash"];

  // Creating data structure for our current block
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock["index"] + 1
  };

  // Getting the mathematical result
  const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData);

  // Hashing the new block
  const blockHash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce);

  // Creating the new block
  const newBlock = bitcoin.createNewBlock(nonce, prevBlockHash, blockHash);

  // Geting all network nodes for broadcasting new block
  allNetworkNodes = bitcoin.networkNodes;

  // Broadcasting our new block to the all other network nodes
  let regTransactionPromises = [];

  //Registering the new block with already present nodes
  allNetworkNodes.forEach(networkNodeUrl => {
    //Sending promise request to each networkUrl seperatly
    const newRegisterPromiseRequest = axios.post(
      `${networkNodeUrl}/receive_new_block`,
      {
        newBlock
      }
    );

    // Pushing the promise to the promises array
    regTransactionPromises.push(newRegisterPromiseRequest);
  });

  // Executing all the promises
  Promise.all(regTransactionPromises)
    .then(data => {
      return axios.post(`${bitcoin.currentNodeUrl}/transaction/broadcast`, {
        // Adding reward transaction to the network who mined the block
        amount: 12.5,
        sender: "00",
        recipient: nodeAddress
      });
    })
    .then(data => {
      // Just sending back the newly created block
      res.json({
        note: "New block mined and broadcast successfully",
        block: newBlock
      });
    });
});

// This endpoint will receive new block and reset the pending transactions
app.post("/receive_new_block", (req, res) => {
  // Extracting new block from the request
  const newBlock = req.body.newBlock;

  // Getting the last block
  const lastBlock = bitcoin.getLastBlock();

  // Authenticating with hashes
  const currectHash = lastBlock.hash === newBlock.previousBlockHash;

  // Authenticating with index
  const currectIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (currectHash && currectIndex) {
    // Adding new block to our blockchain
    bitcoin.chain.push(newBlock);

    //Setting the pendingTransactions to default
    bitcoin.pendingTransactions = [];
    res.json({
      note: "New block received and accepted.",
      newBlock
    });
  } else {
    res.json({
      note: "New block rejected.",
      newBlock
    });
  }
});

// Registering a new network node and broadcasting that
// node to the whole network
app.post("/register_and_broadcast_node", (req, res) => {
  // Getting the url of new network node
  const newNodeUrl = req.body.newNodeUrl;

  // Getting all the registered nodes
  let allNetworkNodes = bitcoin.networkNodes;

  // Checking if the node alredy there
  // If not register that
  if (allNetworkNodes.indexOf(newNodeUrl) === -1) {
    // Putting the new node url in the main blockchain network array
    allNetworkNodes.push(newNodeUrl);
  }

  // Broadcasting our node to the all other network nodes
  let regNodesPromises = [];

  //Registering the new node with already present nodes
  allNetworkNodes.forEach(networkNodeUrl => {
    //Sending promise request to each networkUrl seperatly
    const newRegisterPromiseRequest = axios.post(
      `${networkNodeUrl}/register_node`,
      {
        newNodeUrl
      }
    );

    // Pushing the promise to the promises array
    regNodesPromises.push(newRegisterPromiseRequest);
  });

  // Executing all the promises
  Promise.all(regNodesPromises)
    .then(data => {
      // Registering all the nodes with the new node
      return axios.post(`${newNodeUrl}/register_nodes_bulk`, {
        allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
      });
    })
    .then(data =>
      res.json({
        note: "New node registered to the network successfully."
      })
    );
});

// Registering Node for each of the network node seperatly
app.post("/register_node", (req, res) => {
  // Getting the url of new network node
  const newNodeUrl = req.body.newNodeUrl;

  // Getting all the registered nodes
  let allNetworkNodes = bitcoin.networkNodes;

  // Checking if the node alredy there
  // If not register that
  if (
    allNetworkNodes.indexOf(newNodeUrl) === -1 &&
    newNodeUrl !== bitcoin.currentNodeUrl
  ) {
    // Putting the new node url in the main blockchain network array
    allNetworkNodes.push(newNodeUrl);
  }
  res.json({
    note: "New node registered successfully."
  });
});

// Registering Multiple Nodes at once
app.post("/register_nodes_bulk", (req, res) => {
  // Extracting all the nodes from the request
  const allNetworkNodes = req.body.allNetworkNodes;

  // Getting each node url seperatly
  allNetworkNodes.forEach(networkNodeUrl => {
    // Checking if the node is already there
    const nodeAlredyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl);

    // Checking if the node is current node
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;

    // If node is not present and not is not current node then
    // we will add this to our network nodes array
    if (nodeAlredyPresent && notCurrentNode) {
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });
  res.json({
    note: "Bulk registeration successful."
  });
});

// Doing consensus endpoint to make sure a blockchain is valid
app.get("/consensus", (req, res) => {
  // Extracting all the nodes from the request
  const allNetworkNodes = bitcoin.networkNodes;

  // Storing all nodes blockchain promise
  let regNodesPromises = [];

  //Registering the new node with already present nodes
  allNetworkNodes.forEach(networkNodeUrl => {
    //Sending promise request to each networkUrl seperatly
    const newRegisterPromiseRequest = axios.get(`${networkNodeUrl}/blockchain`);
    // Pushing the promise to the promises array
    regNodesPromises.push(newRegisterPromiseRequest);
  });

  // Executing all the promises
  Promise.all(regNodesPromises)
    .then(blockchains => {
      const currentChainLength = bitcoin.chain.length;
      let maxChainLength = currentChainLength;
      let newLongestChain = null;
      let newPendingTransactions = null;

      // Extracting out out blockchains from the response
      blockchains = blockchains.map(response => response.data);

      // Performing a for each to iterate through all the blockchain array
      blockchains.forEach(blockchain => {
        let chainLength = blockchain.chain.length;

        // Setting up maxlength chain
        if (chainLength > maxChainLength) {
          maxChainLength = chainLength;
          newLongestChain = blockchain.chain;
          newPendingTransactions = blockchain.pendingTransactions;
        }
      });

      // Checking the validity of the chain
      if (
        !newLongestChain ||
        (newLongestChain && !bitcoin.chainIsValid(newLongestChain))
      ) {
        res.json({
          note: "Current chain has not been replaced",
          chain: bitcoin.chain
        });
      }

      // Checking the validity of the chain
      else if (newLongestChain && bitcoin.chainIsValid(newLongestChain)) {
        // Updating values of out current blockchian
        bitcoin.chain = newLongestChain;
        bitcoin.pendingTransactions = newPendingTransactions;
        res.json({
          note: "Current chain has been replaced Successfully",
          chain: bitcoin.chain
        });
      }
    })
    .catch(error =>
      res.json({
        note: "Current chain has not been replaced",
        error: error
      })
    );
});
// At this end point we will be searching a block using it`s hash
app.get("/block/:blockHash", (req, res) => {
  // Extracting out the block hash from the url
  const blockHash = req.params.blockHash;

  // Getting the block using the getBlock method
  const currectBlock = bitcoin.getBlock(blockHash);

  // Returning back the block to the user
  res.json({
    block: currectBlock
  });
});

// At this end point we will be searching a transaction using it`s id
app.get("/transaction/:transactionId", (req, res) => {});

// At this end point we will be searching a note using it`s address
// and see how many coins it has
app.get("/address/:address", (req, res) => {});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
