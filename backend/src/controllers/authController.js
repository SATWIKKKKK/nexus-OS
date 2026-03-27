const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
    });

    if (user) {
      res.status(201).json({
        data: {
          user: { _id: user._id, name: user.name, email: user.email, role: user.role },
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        data: {
          user: { _id: user._id, name: user.name, email: user.email, role: user.role },
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const logout = async (req, res) => {
  res.status(200).json({ data: { message: 'User logged out' } });
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
