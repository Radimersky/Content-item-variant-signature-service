const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const hash = require("object-hash");
const fs = require("fs");
const cors = require("cors");
const ellipticCurve = require("starkbank-ecdsa");
const { keys } = require("object-hash");

const Ecdsa = ellipticCurve.Ecdsa;
const PrivateKey = ellipticCurve.PrivateKey;
const Signature = ellipticCurve.Signature;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


const router = express.Router();


// create application/json parser
const jsonParser = bodyParser.json();

// Read private key from file
const pem = fs.readFileSync("./keys/private-key.pem");
const key = pem.toString("ascii");

// Generate privateKey from PEM string
const privateKey = PrivateKey.fromPem(key);

router.get("/", (req, res) => {
    res.json({
        state: 'the server is running'
    }); 
});

router.get("/publickey", (req, res) => {
    const key = getPublicKey();
    res.json({
        publickey: key
    });
});

router.post("/sign", jsonParser, (req, res) => {
    const data = req.body;

    if (!data) {
        res.status(400).json({ message: "Please provide data to sign" });
    }

    res.json(sign(data));
});
  
router.post("/verify", jsonParser, (req, res) => {
    const { message, signature } = req.body;

    if (!message || !signature) {
        res.status(400).json({
        message: "Please provide request message and signature in request body"
        });
    }

    const verified = verify(message, signature);

    res.json({ verified });
});
  
const signHash = (message) => {
    const signature = Ecdsa.sign(JSON.stringify(message), privateKey);
    return signature.toBase64();
  };
  
  const getPublicKey = () => {
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

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);