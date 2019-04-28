// creating a constructor

function Blockchain() {
  this.chain = [];
  this.newTransactions = [];
}

//Nonce is the result of mathematical problem solved by user

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.newTransactions,
    nonce,
    hash,
    previousBlockHash
  };
  this.newTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

//To get last block from the blockchain

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.getLastBlock = function(amount, sender, recipient) {
  const newTransaction = {
    amount,
    sender,
    recipient
  };
  this.newTransactions.push(newTransaction);
};

module.exports = Blockchain;
