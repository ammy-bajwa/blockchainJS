const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

bitcoin.createNewBlock(32342, "HSKJD78864TG#$778", "SHGF67rt34TUYFDG");
bitcoin.createNewBlock(234342, "HSKJD78864TG#$778", "SHGF67we34TUYFDG");
bitcoin.createNewBlock(43342, "HSKJD78864TG#$778", "SHGF673344TUYFDG");

// This transaction will be available in the next minnied block

bitcoin.createNewTransaction(100, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");

//Last transaction will be availale in this block

bitcoin.createNewBlock(43342, "HSKJD78864TG#$778", "SHGF673344TUYFDG");

//Some pending transactions

bitcoin.createNewTransaction(200, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");
bitcoin.createNewTransaction(300, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");
bitcoin.createNewTransaction(400, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");
bitcoin.createNewTransaction(500, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");

bitcoin.createNewBlock(
  23443342,
  "SJKHDFKJ347HSKJD78864TG#$778",
  "489HSDFJSHGF673344TUYFDG"
);

// console logging the whole blockchain

// console.log(
//   "=========================  Bitcoin  ==============================="
// );

// console.log(bitcoin);

// // console logging the block that has the first transaction

// console.log(
//   "=============================  Specific Block With One Transaction  ==========================="
// );

// console.log(bitcoin.chain[3]);

// // console logging the block that has Multiple transaction

// console.log(
//   "=============================  Specific Block  With Multipe Transactions  ==========================="
// );

// console.log(bitcoin.chain[3]);

// // console logging pending transactions

// console.log(
//   "=========================  Getting All Pending Transactions ==============================="
// );

// console.log(bitcoin.pendingTransactions);

console.log(
  bitcoin.hashBlock(
    "32KFDFH4H83FH",
    [
      {
        sender: "323HBF#HFSJJ",
        recipient: "56rtHBF#HFSJJ",
        amout: 566
      }
    ],
    324234
  )
);

console.log(
  bitcoin.proofOfWork("32KFDFH4H83FH", [
    {
      sender: "323HBF#HFSJJ",
      recipient: "56rtHBF#HFSJJ",
      amout: 566
    }
  ])
);
