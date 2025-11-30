const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_assignment_only';

// ====== POST /api/v1/user/signup ======
userRouter.post(
  '/signup',
  [
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: 'User already exists'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password: hashedPassword
      });

      await user.save();

      return res.status(201).json({
        status: true,
        message: 'User created successfully',
        user_id: user._id
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }
);

// ====== POST /api/v1/user/login ======
userRouter.post(
  '/login',
  [
    body('username')
      .optional()
      .isString()
      .withMessage('Username must be a string'),
    body('email').optional().isEmail().withMessage('Provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      if (!username && !email) {
        return res.status(400).json({
          status: false,
          message: 'Please provide either username or email to log in'
        });
      }

      const user = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User does not exist'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          status: false,
          message: 'Incorrect password'
        });
      }

      // Create JWT
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        status: true,
        message: 'Login successful',
        token
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }
);

module.exports = userRouter;
