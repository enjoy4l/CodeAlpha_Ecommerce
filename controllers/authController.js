const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const passwordSaltRounds = 12;

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from the .env file.');
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    res.status(500).json({ message: 'Could not register the user.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createToken(user._id.toString());

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not log in.' });
  }
}

module.exports = {
  register,
  login
};