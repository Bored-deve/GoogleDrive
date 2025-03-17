const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const sellerModel = require('../models/seller.model');

// Get seller registration page
router.get('/register',
  (req, res) => {
    res.render('seller/register');
  });

// Register a new seller
router.post('/register-seller',
  body('email').trim().isEmail().isLength({ min: 13 }),
  body('password').trim().isLength({ min: 5 }),
  body('username').trim().isLength({ min: 3 }),
  body('businessName').trim().isLength({ min: 3 }),
  body('businessAddress').trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data'
      });
    }

    const { username, email, password, businessName, businessAddress } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    
    try {
      const newSeller = await sellerModel.create({
        username,
        email,
        password: hashPassword,
        businessName,
        businessAddress
      });
      res.status(201).json(newSeller);
    } catch (error) {
      res.status(500).json({ message: 'Error creating seller account', error: error.message });
    }
  });

// Get seller login page
router.get('/login',
  (req, res) => {
    res.render('seller/login');
  });

// Login seller
router.post('/login-seller',
  body('email').trim().isEmail(),
  body('password').trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data'
      });
    }

    const { email, password } = req.body;
    
    try {
      const seller = await sellerModel.findOne({ email });
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, seller.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      res.json({ message: 'Login successful', seller });
    } catch (error) {
      res.status(500).json({ message: 'Error during login', error: error.message });
    }
  });

// Get seller profile
router.get('/profile/:id',
  async (req, res) => {
    try {
      const seller = await sellerModel.findById(req.params.id).select('-password');
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
      res.json(seller);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching seller profile', error: error.message });
    }
  });

module.exports = router; 