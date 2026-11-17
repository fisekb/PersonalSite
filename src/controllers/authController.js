const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');

const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), normalizedEmail)
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = signToken(user);

  return sendResponse(res, 200, 'Login successful.', {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const me = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, 'User profile retrieved.', {
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = {
  login,
  me
};
