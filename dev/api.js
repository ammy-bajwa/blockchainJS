// Importing the express library
const express = require("express");
const app = express();

// Importing our blockchain contrunctor
const Blockchain = require("./blockchain");

// Initializing our blockchain on the server
let bitcoin = new Blockchain();

// Specifying the port number on which server runs
const port = 3000;

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
app.get("/mine", (req, res) => {
  const lastBlock = bitcoin.getLastBlock();
  const prevBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock["index"] + 1
  };
  const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce);
  const newBlock = bitcoin.createNewBlock(nonce, prevBlockHash, blockHash);

  bitcoin.createNewTransaction(12.5, "00", nodeAddress);
  res.json({
    note: "New block mined successfully",
    block: newBlock
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
