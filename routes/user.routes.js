const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register-user', (req, res) => {
  console.log(req.body);
  res.send('User registered');
});

module.exports = router;