const express = require("express");
const app = express();
const port = 3000;
var bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// parse application/json
app.use(bodyParser.json());

app.get("/blockchain", (req, res) => res.send("Hello World!"));
app.post("/transaction", (req, res) => {
  console.log(req.body);
  res.send(`Amount is ${req.body.amount} and sender is ${req.body.sender}`);
});
app.get("/mine", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
