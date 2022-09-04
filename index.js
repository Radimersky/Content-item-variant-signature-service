const express = require("express");
const bodyParser = require("body-parser");
const hash = require("object-hash");
const crypto = require("crypto");
const fs = require("fs");
const cors = require("cors");
const ellipticcurve = require("starkbank-ecdsa");

const Ecdsa = ellipticcurve.Ecdsa;
const PrivateKey = ellipticcurve.PrivateKey;
const Signature = ellipticcurve.Signature;

const app = express();
app.use(cors());

// create application/json parser
const jsonParser = bodyParser.json();

// Read private key from file
const pem = fs.readFileSync("./keys/private-key.pem");
const key = pem.toString("ascii");

// Generate privateKey from PEM string
const privateKey = PrivateKey.fromPem(key);

app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

app.get("/publickey", (req, res) => {
  const key = getPublicKey();
  res.send(key);
});

app.post("/sign", jsonParser, (req, res) => {
  const data = req.body;

  if (!data) {
    res.status(400).send({ message: "Please provide data to hash" });
  }

  res.send(sign(data));
});

app.post("/verify", jsonParser, (req, res) => {
  const { message, signature } = req.body;

  if (!message || !signature) {
    res.status(400).send({
      message: "Please provide request message and signature in request body"
    });
  }

  const verified = verify(message, signature);

  res.send({ verified });
});

app.listen(3001, () => {
  console.log("Server started on port 3001.");
  console.log("Local server: http://localhost:3001/");
});

const signHash = (message) => {
  const signature = Ecdsa.sign(JSON.stringify(message), privateKey);
  return signature.toBase64();
};

const getPublicKey = () => {
  // Read private key from file
  const pem = fs.readFileSync("./keys/public-key.pem");
  const key = pem.toString("ascii");
  return key;
};

const verify = (message, signature) => {
  const publicKey = privateKey.publicKey();
  const parsedSignature = Signature.fromBase64(signature);
  return Ecdsa.verify(JSON.stringify(message), parsedSignature, publicKey);
};

const sign = (data) => {
  const dataHash = hash(data);
  const hashSignature = signHash(dataHash);

  return { hash: dataHash, signature: hashSignature };
};

module.exports = {
  verify,
  sign
};

