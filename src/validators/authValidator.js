const { body } = require('express-validator');

const loginValidation = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('A valid email is required.'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
];

module.exports = {
  loginValidation
};
