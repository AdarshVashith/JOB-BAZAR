const { configDotenv } = require("dotenv");
const prisma = require("../db/prisma.js");
const { hashPassword, verifyPassword } = require("../Utils/bcryptPassword.js");
const { generateToken } = require("../Utils/token.js");
configDotenv();
const signupUser = async (req, res) => {
  console.log('🚀 Signup request received');
  console.log('📝 Request body:', { ...req.body, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });
  
  const { name, email, phoneNumber, password, confirmPassword, role } = req.body;

  // Validation logging
  if (!name || !email || !phoneNumber || !password || !confirmPassword) {
    console.log('❌ Validation failed: Missing required fields');
    console.log('📝 Field check:', { name: !!name, email: !!email, phoneNumber: !!phoneNumber, password: !!password, confirmPassword: !!confirmPassword });
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (password !== confirmPassword) {
    console.log('❌ Validation failed: Passwords do not match');
    return res.status(400).json({ message: "Passwords do not match!" });
  }

  try {
    console.log('🔍 Checking for existing user with email:', email);
    const existingUser = await prisma.users.findFirst({ where: { email } });
    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({ message: "User already exists!" });
    }

    console.log('🔒 Hashing password...');
    const hashedPassword = await hashPassword(password);
    
    console.log('📦 Creating new user in database...');
    const newUser = await prisma.users.create({
      data: { name, email, phoneNumber, password: hashedPassword, role: role || 'candidate' },
    });
    console.log('✅ User created successfully with ID:', newUser.id);

    console.log('🔑 Generating token...');
    const tokens = generateToken(newUser.id);
    console.log('✅ Token generated successfully');
    
    return res.status(201).json({ message: "User created successfully!", token: tokens.accessTokens });
  } catch (err) {
    console.error('🔥 Signup error details:');
    console.error('🔥 Error name:', err.name);
    console.error('🔥 Error message:', err.message);
    console.error('🔥 Error code:', err.code);
    console.error('🔥 Full error:', err);
    
    // More specific error handling
    if (err.code === 'P2002') {
      console.error('🔥 Prisma unique constraint violation');
      return res.status(400).json({ message: "Email already exists!" });
    }
    
    return res.status(500).json({ message: "Server Error: " + err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const tokens = generateToken(user.id);
    return res.status(200).json({ message: "Login successful!", token: tokens.accessTokens, name: user.name, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: "Server Error!" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.status(200).json({ name: user.name, email: user.email, phoneNumber: user.phoneNumber });
  } catch (err) {
      console.error('Get user error:', err);
    return res.status(500).json({ message: "Server Error!" });
  }
};

module.exports = { signupUser, loginUser, getUser };
