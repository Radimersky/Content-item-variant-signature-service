const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// create application/json parser
var jsonParser = bodyParser.json()

app.get('/', (req, res) => {
  res.send('<h1>Home page</h1>');
});

app.post('/sign', jsonParser, (req, res) => {
  const {name} = req.body;
  console.log(req.body);
  if (!name) {
    res.status(400).send({ message: "Please add name of user"});
  }
  res.send({ name: name, id: 3});
});

app.listen(3001, () => {
  console.log('Server started on port 3001.');
  console.log('Local server: http://localhost:3001/');
});
