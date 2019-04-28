// creating a constructor

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
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

module.exports = Blockchain;
