// Importing the express library
const express = require("express");
const app = express();

// Importing our blockchain contrunctor
const Blockchain = require("./blockchain");

// Initializing our blockchain on the server
let bitcoin = new Blockchain();

// Specifying the port number on which server runs
const port = 3000;

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


app.post("/transaction", (req, res) => {
  console.log(req.body);
  res.send(`Amount is ${req.body.amount} and sender is ${req.body.sender}`);
});
app.get("/mine", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
