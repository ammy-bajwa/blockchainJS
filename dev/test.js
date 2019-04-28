const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

bitcoin.createNewBlock(32342, "HSKJD78864TG#$778", "SHGF67rt34TUYFDG");
bitcoin.createNewBlock(234342, "HSKJD78864TG#$778", "SHGF67we34TUYFDG");
bitcoin.createNewBlock(43342, "HSKJD78864TG#$778", "SHGF673344TUYFDG");

console.log(bitcoin);
