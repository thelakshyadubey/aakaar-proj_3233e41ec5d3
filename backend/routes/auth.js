const express = require('express');
const { body, validationResult } = require('express-validator');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Initialize Sequelize instance using DATABASE_URL from environment
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// Define User model based on typical auth schema
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Sync model with database (optional, in production use migrations)
sequelize.sync();

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

// POST /auth/register - Register a new user
router.post(
  '/register',
  [
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({ email, password: hashedPassword });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: user.id, email: user.email },
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
);

// POST /auth/login - Login user
router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .exists()
      .withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email },
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }
);

// GET /auth/me - Get current user info (protected)
router.get(
  '/me',
  // Auth middleware will be applied in server.js or routes index; here we assume it's attached
  async (req, res) => {
    // req.user should be set by auth middleware
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['password'] },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  }
);

module.exports = router;