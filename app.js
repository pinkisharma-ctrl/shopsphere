const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { specs } = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
mongoose.connect('mongodb://127.0.0.1:27017/', { useNewUrlParser: true,useUnifiedTopology: true}); // Connect to MongoDB
const db = mongoose.connection;
db.once('open', () => console.log('✅ Connected to MongoDB'));
// app.get('/api/todo', async (req, res) => {// Routes
//   const todos = await Todo.find();
//   res.json(todos);
// });

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user with email, password, and username. Returns JWT token and user data.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               username:
 *                 type: string
 *                 example: JohnDoe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
app.post('/api/signup', async (req, res) => {
  const { email, password, username } = req.body;
  console.log('Incoming signup:', req.body); // ✅ log input
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists');
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 4);
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save(); // <-- This might throw
    const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json({ token, user: userData });
  } catch (err) {
    console.error('Signup Error:', err); // ✅ log error
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // Check if email or password is missing
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Use environment variable for JWT secret
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    // Exclude the password from the user data being sent back
    const { password: _, ...userData } = user.toObject();
    // Send the response
    res.json({ token, user: userData });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/getProfile:
 *   get:
 *     summary: Get user profile
 *     description: Returns user profile data based on JWT token in the Authorization header.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *       401:
 *         description: Unauthorized - No token or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
app.get('/api/getProfile', async (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);  // Logs the full header to check if it contains 'Bearer <token>'
// Extract token from the header
  const token = authHeader && authHeader.split(' ')[1]; // Split by space, expected format: 'Bearer <token>'
  console.log('Extracted Token:', token);
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    console.log('Decoded Token:', decoded);  // Log the decoded token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password: _, ...userData } = user.toObject();
    res.json({ user: userData });
  } catch (err) {
    console.error('Profile Error:', err);  // Log the error stack for detailed information
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {console.log(`🚀 Server running at http://localhost:${PORT}`)});// Start Server
