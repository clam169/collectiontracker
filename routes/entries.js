const router = require('express').Router();
const database = include('../mockData.js');
const inputValidation = require('../middleware/inputValidation');

router.post('/add', inputValidation.validateInput, (req, res) => {
  //middleware validates input data. If all good then spits out this message
  res.send('data looks acceptable!');
});
