const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// user register

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register-user',
  body('email').trim().isEmail().isLength({ min: 13 }),
  body('password').trim().isLength({ min: 5 }),
  body('username').trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data'
      })
    }

    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await userModel.create({
      username,
      email,
      password: hashPassword
    })

    res.json(newUser);

    console.log(req.body);
  });

// user login

router.get('/login', (req, res) => {
  res.render('login')
});

router.post('/login-user',
  body('username').trim().isLength({ min: 3 }),
  body('password').trim().isLength({ min: 5 }),
  async (req, res) => {
    console.log('Received body:', req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data'
      })
    }

    const { username, password } = req.body;

    const user = await userModel.findOne({ username: username });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid username or password'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid username or password'
      })
    }

    // JsonWebToken

    const token = jwt.sign({
      userID: user._id,
      email: user.email,
      username: user.username
    },
      process.env.JWT_SECRET,
    )

    res.cookie('JWTtoken' , token)
    res.send('logged in successfully');

  });
module.exports = router;