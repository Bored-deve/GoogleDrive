const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// user register

router.get('/register',
  (req, res) => {
    res.render('register');
  });

router.post('/register-user',
  body('user_email').trim().isEmail().isLength({ min: 13 }),
  body('user_password').trim().isLength({ min: 5 }),
  body('user_name').trim().isLength({ min: 3 }),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data'
      })
    }

    else {
      res.send('data recieved nigga');
    }

    console.log(req.body);
  });

module.exports = router;