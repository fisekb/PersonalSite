const express = require('express');
const { login, me } = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const { loginLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');
const { loginValidation } = require('../validators/authValidator');

const router = express.Router();

router.post('/login', loginLimiter, loginValidation, validate, login);
router.get('/me', authenticate, me);

module.exports = router;
