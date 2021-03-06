const sha256 = require("sha256");
const currentNodeUrl = process.argv[3];

// Getting uuid library to generate random address for network node
const uuid = require("uuid/v1");

// creating a constructor
function Blockchain() {
  // Main blocks array
  this.chain = [];

  // Setting the node url for each instance of node
  this.currentNodeUrl = currentNodeUrl;

  // Storing all the active nodes
  this.networkNodes = [];

  // Store all the pending transactions
  this.pendingTransactions = [];

  // Creating genesis block blockchain
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
    recipient,

    //Adding transaction id
    transactionId: uuid()
      .split("-")
      .join("")
  };

  return newTransaction;
};

// Adding transaction to pending transactions
Blockchain.prototype.addTransactionToPendingTransactions = function(
  newTransaction
) {
  this.pendingTransactions.push(newTransaction);
  //This will be the index of the block in which we will record our transactions
  return this.getLastBlock()["index"] + 1;
};

//Hashing a block method using sha256
Blockchain.prototype.hashBlock = function(
  previousBlockHash,
  currentBlockData,
  nonce
) {
  // Creating string for the sha256 Algorithm to generate hash
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};

//Adding Proof of work method
Blockchain.prototype.proofOfWork = function(
  previousBlockHash,
  currentBlockData
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 2) !== "00") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    // console.log(hash);
  }
  return nonce;
};

// Doing consenses algorithm
// Validating if a blockchain contains correct data
Blockchain.prototype.chainIsValid = function(blockchain) {
  // Initially chain is valid
  let validChain = true;

  // Performing for loop through blockchain
  // Checking each block data
  // We are skiping genesis block here
  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i],
      prevBlock = blockchain[i - 1],
      // Generating the block hash again to see that if the data inside a block
      // is correct
      blockHash = this.hashBlock(
        prevBlock["hash"],
        {
          transactions: currentBlock["transactions"],
          index: currentBlock["index"]
        },
        currentBlock["nonce"]
      );

    // Checking current block hash with previous block hash
    // to see if that block is correct
    if (
      currentBlock["previousBlockHash"] !== prevBlock["hash"] ||
      blockHash.substring(0, 2) !== "00"
    ) {
      validChain = false;
    }
  }

  // Validating the genesis block
  const genesisBlock = blockchain[0];
  const correctNonce = genesisBlock["nonce"] === 100;
  const correctPreviousBLockHash = genesisBlock["previousBlockHash"] === "0";
  const correctHash = genesisBlock["hash"] === "0";
  const correctTransactions = genesisBlock["transactions"].length === 0;

  if (
    !correctNonce ||
    !correctPreviousBLockHash ||
    !correctHash ||
    !correctTransactions
  ) {
    validChain = false;
  }
  // returning state of chain valid or not valid
  return validChain;
};

// Getting a specific block using the block hash property
Blockchain.prototype.getBlock = function(blockHash) {
  // Here we will store if we have a block
  let currectBlock = null;

  // Iterating over the chain array inside the blockchain
  this.chain.forEach(block => {
    // comparing the block hash and given hass
    if (block.hash === blockHash) {
      // Assigning the found block
      currectBlock = block;
    }
  });

  // Returning the block if found else null
  return currectBlock;
};

// Getting a specific transaction using the transactionId property
Blockchain.prototype.getTransaction = function(transactionId) {
  // Here we will store if we have a transaction
  let currectTransaction = null;
  let currectBlock = null;

  // Iterating over the chain array inside the blockchain
  this.chain.forEach(block => {
    // Iterating over each transaction array inside the block
    block.transactions.forEach(transaction => {
      // comparing ids of each of the transaction
      if (transaction.transactionId === transactionId) {
        // Assigning currect transaction and block
        currectTransaction = transaction;
        currectBlock = block;
      }
    });
  });

  // Returning the transaction and block if found else null
  return {
    transaction: currectTransaction,
    block: currectBlock
  };
};

// Getting a specific Address data using its address property
Blockchain.prototype.getAddressData = function(address) {
  // Here we will store the address transactions
  let addressTransactions = [];

  // Assigning initial balance to the address
  let addressBalance = 0;
  // Iterating over the chain array inside the blockchain
  this.chain.forEach(block => {
    // Iterating over each transaction array inside the block
    block.transactions.forEach(transaction => {
      // comparing ids of each of the transaction
      if (transaction.sender === address || transaction.recipient === address) {
        // Adding transaction into
        // the main transactions aray of the address
        addressTransactions.push(transaction);
      }
    });
  });

  addressTransactions.forEach(transaction => {
    if (transaction.recipient === address) addressBalance += transaction.amount;
    else if (transaction.sender === address)
      addressBalance -= transaction.amount;
  });

  // Returning the transaction and balance of the address
  return {
    addressTransactions,
    addressBalance
  };
};
module.exports = Blockchain;
