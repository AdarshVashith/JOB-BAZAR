const User = require('../models/User');
const jwt = require('jsonwebtoken');
// authentication ke liye —  
// token milta hai jo har request ke saath verify hota hai.

// Generate JWT Token
const generateToken = (id) => 
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Common response handler (to avoid repetition)
const sendResponse = (res, statusCode, success, message, data = {}) => {
  res.status(statusCode).json({ success, message, ...data });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Basic validation
    if (!name || !email || !password || !passwordConfirm)
      return sendResponse(res, 400, false, 'Please provide all required fields');

    if (password !== passwordConfirm)
      return sendResponse(res, 400, false, 'Passwords do not match');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return sendResponse(res, 400, false, 'Email is already in use');

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    // Hide password in response
    user.password = undefined;

    sendResponse(res, 201, true, 'User registered successfully', { token, user });
  } catch (error) {
    console.error('Signup error:', error);
    sendResponse(res, 500, false, error.message || 'Server error');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password)
      return sendResponse(res, 400, false, 'Please provide email and password');

    // Find user (with password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) return sendResponse(res, 401, false, 'Invalid credentials');

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return sendResponse(res, 401, false, 'Invalid credentials');

    // Generate token
    const token = generateToken(user._id);
    user.password = undefined;

    sendResponse(res, 200, true, 'Login successful', { token, user });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, error.message || 'Server error');
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    sendResponse(res, 200, true, 'User fetched successfully', { user });
  } catch (error) {
    sendResponse(res, 500, false, error.message || 'Server error');
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (_, res) =>
  sendResponse(res, 200, true, 'Logged out successfully');
