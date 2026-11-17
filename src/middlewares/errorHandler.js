const { sendResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err.name === 'SequelizeValidationError') {
    return sendResponse(res, 400, 'Validation failed.', {
      errors: err.errors.map((error) => ({
        field: error.path,
        message: error.message
      }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors?.[0]?.path || 'field';
    const message = err.errors?.[0]?.message || 'Duplicate value found.';

    return sendResponse(res, 409, 'Duplicate value detected.', {
      field,
      message
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendResponse(res, 401, err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.', null);
  }

  if (err.name === 'SequelizeDatabaseError') {
    return sendResponse(res, 400, 'Database query failed.', {
      message: err.message
    });
  }

  if (statusCode >= 500) {
    console.error('Unhandled error:', err);
  }

  return sendResponse(res, statusCode, err.message || 'Something went wrong.', null);
};

module.exports = errorHandler;
