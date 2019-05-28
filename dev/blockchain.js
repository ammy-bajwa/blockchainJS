const sha256 = require("sha256");
// creating a constructor

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.createNewBlock(100, "0", "0");
}

//Nonce is the result of mathematical problem solved by user

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce,
    hash,
    previousBlockHash
  };
  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

//To get last block from the blockchain

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

// These are unvalidated and unmined transactions that need minning

Blockchain.prototype.createNewTransaction = function(
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount,
    sender,
    recipient
  };
  this.pendingTransactions.push(newTransaction);

  //This will be the index of the block in which we will record our transactions

  return this.getLastBlock()["index"] + 1;
};

///Hashing a block method using sha256

Blockchain.prototype.hashBlock = function(
  previousBlockHash,
  currrentBlockData,
  nonce
) {
  // Creating string for the sha256 Algorithm to generate hash
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currrentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};

//Adding Proof of work method

Blockchain.prototype.proofOfWork = function(
  previousBlockHash,
  currrentBlockData
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currrentBlockData, nonce);
  while (hash.substring(0, 2) !== "00") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currrentBlockData, nonce);
    console.log(hash);
  }
  return nonce;
};

module.exports = Blockchain;
