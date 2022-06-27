const express = require("express");
const bodyParser = require("body-parser");
const hash = require("object-hash");
var crypto = require("crypto");
var fs = require("fs");

const app = express();

// create application/json parser
var jsonParser = bodyParser.json();

app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

app.post("/sign", jsonParser, (req, res) => {
  const data = req.body;

  if (!data) {
    res.status(400).send({ message: "Please provide data to hash" });
  }

  const dataHash = hash(data);
  const hashSignature = signHash(dataHash)

  res.send({ hash: dataHash, signature: hashSignature });
});

app.listen(3001, () => {
  console.log("Server started on port 3001.");
  console.log("Local server: http://localhost:3001/");
});

const signHash = (hash) => {
  // Read private key from file
  const pem = fs.readFileSync("./keys/key");
  const key = pem.toString("ascii");

  var sign = crypto.createSign("RSA-SHA256");
  sign.update(hash); // data from your file would go here

  var sig = sign.sign(key, "hex");
  return sig;
};