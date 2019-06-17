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

// Sending back our complete blockchain to the client
app.get("/blockchain", (req, res) => res.send(bitcoin));

// We will get the amount, sender and the recipient from the client
// we wil add the create the new transaction and send back the
// index on which that transaction will be added after proof of work
app.post("/transaction", (req, res) => {
  // Extracting amount from the request
  let amount = req.body.amount,
    // Extracting sender and recipient
    sender = req.body.sender,
    recipient = req.body.recipient;

  // Getting the transaction index number
  const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient);

  // Sending back transaction index to the client
  res.json({
    note: `Transaction will be added in block ${blockIndex}.`
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

  // Adding reward transaction to the network who mined the block
  bitcoin.createNewTransaction(12.5, "00", nodeAddress);

  // Just sending back the newly created block
  res.json({
    note: "New block mined successfully",
    block: newBlock
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
