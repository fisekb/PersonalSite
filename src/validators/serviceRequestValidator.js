const { body, param, query } = require('express-validator');
const { checkSchema } = require('express-validator');

const serviceRequestCreateValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Name must be between 2 and 120 characters.')
    .customSanitizer((value) => value.replace(/[<>]/g, '')),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage('Phone number must be between 5 and 30 characters.')
    .customSanitizer((value) => value.replace(/[<>]/g, '')),
  body('serviceType')
    .trim()
    .isIn([
      'web-development',
      'api-development',
      'database-design',
      'deployment',
      'consulting',
      'other'
    ])
    .withMessage('Invalid service type.'),
  body('budgetRange')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 80 })
    .withMessage('Budget range must be 80 characters or fewer.')
    .customSanitizer((value) => value.replace(/[<>]/g, '')),
  body('message')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Message must be between 20 and 2000 characters.')
    .customSanitizer((value) => value.replace(/[<>]/g, ''))
];

const serviceRequestUpdateStatusValidation = [
  param('id').isUUID().withMessage('Request ID must be a valid UUID.'),
  body('status')
    .trim()
    .isIn(['new', 'in-review', 'accepted', 'rejected', 'completed'])
    .withMessage('Status is invalid.')
];

const serviceRequestListValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50.'),
  query('status').optional().isIn(['new', 'in-review', 'accepted', 'rejected', 'completed']).withMessage('Status filter is invalid.')
];

const serviceRequestByIdValidation = [
  param('id').isUUID().withMessage('Request ID must be a valid UUID.')
];

module.exports = {
  serviceRequestCreateValidation,
  serviceRequestUpdateStatusValidation,
  serviceRequestListValidation,
  serviceRequestByIdValidation
};
