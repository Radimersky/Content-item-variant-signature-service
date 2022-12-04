# Content item variant signature service

This project serves as a signature provider.
Given public and private keys in the "keys" folder, it provides:
- **/sign** endpoint that hashes and signs JSON data and then returns the hash and the hash signature
- **/verify** endpoint that verifies if the given signature belongs to given JSON data
- **/publickey** endpoint that provides its public key

It is used by the client interface of the following project to provide signatures of content item variants that are then deployed to the Solana blockchain
- https://github.com/Radimersky/Solana-kontent

The Solana smart contract is available in this project:
- https://github.com/Radimersky/Solana-smart-contract-for-integrity-validation-of-Kontent.ai-content-item-variants


**How to set up**
1. npm install
2. Copy public key file as "public-key.pem" and private key as "private-key-pem" into folder "keys" (the folder already contains testing keys).

**How to run**
1. npm start
   Note: The server is listening on port 3001
