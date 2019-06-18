const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

bitcoin.createNewBlock(32342, "HSKJD78864TG#$778", "SHGF67rt34TUYFDG");
bitcoin.createNewBlock(234342, "HSKJD78864TG#$778", "SHGF67we34TUYFDG");
bitcoin.createNewBlock(43342, "HSKJD78864TG#$778", "SHGF673344TUYFDG");

// This transaction will be available in the next minnied block

bitcoin.createNewTransaction(100, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");

//Last transaction will be availale in this block

// bitcoin.createNewBlock(43342, "HSKJD78864TG#$778", "SHGF673344TUYFDG");

// //Some pending transactions

// bitcoin.createNewTransaction(200, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");
// bitcoin.createNewTransaction(300, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");
// bitcoin.createNewTransaction(400, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");
// bitcoin.createNewTransaction(500, "AMIRGH76SJFG7634", "ZAFAR243HGF24343U");

// bitcoin.createNewBlock(
//   23443342,
//   "SJKHDFKJ347HSKJD78864TG#$778",
//   "489HSDFJSHGF673344TUYFDG"
// );

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

console.log(bitcoin.getLastBlock());

// console.log(
//   bitcoin.hashBlock(
//     "32KFDFH4H83FH",
//     [
//       {
//         sender: "323HBF#HFSJJ",
//         recipient: "56rtHBF#HFSJJ",
//         amout: 566
//       }
//     ],
//     324234
//   )
// );

// console.log(
//   bitcoin.proofOfWork("32KFDFH4H83FH", [
//     {
//       sender: "323HBF#HFSJJ",
//       recipient: "56rtHBF#HFSJJ",
//       amout: 566
//     }
//   ])
// );

const chain = [
  {
    index: 1,
    timestamp: 1560873007703,
    transactions: [],
    nonce: 100,
    hash: "0",
    previousBlockHash: "0"
  },
  {
    index: 2,
    timestamp: 1560873023658,
    transactions: [],
    nonce: 363,
    hash: "005c850455f8bf8801a8901d9908cb6acd33bc49c9d718fcf30867c3cbc91ee3",
    previousBlockHash: "0"
  },
  {
    index: 3,
    timestamp: 1560873036985,
    transactions: [
      {
        amount: 12.5,
        sender: "00",
        recipient: "bf244d8091e011e99bac77964cb20fc9",
        transactionId: "c8a85e5091e011e99bac77964cb20fc9"
      }
    ],
    nonce: 68,
    hash: "009f9066efab60f2798a004eb79e21c4ba2df35dfc900581f3888cbcb48a0fb2",
    previousBlockHash:
      "005c850455f8bf8801a8901d9908cb6acd33bc49c9d718fcf30867c3cbc91ee3"
  }
];

console.log("Value: ", bitcoin.chainIsValid(chain));
