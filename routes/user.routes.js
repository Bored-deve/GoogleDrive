const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
// user register

router.get('/register',
  (req, res) => {
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

module.exports = router;