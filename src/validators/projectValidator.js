const { body, param, query } = require('express-validator');

const projectCreateValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters.'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage('Description must be between 20 and 500 characters.'),
  body('longDescription')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Long description must be between 50 and 5000 characters.'),
  body('techStack')
    .isArray({ min: 1 })
    .withMessage('Tech stack must be an array with at least one item.'),
  body('techStack.*')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each tech stack item must be between 2 and 50 characters.'),
  body('liveUrl')
    .optional({ nullable: true })
    .isURL()
    .withMessage('Live URL must be a valid URL.'),
  body('repoUrl')
    .optional({ nullable: true })
    .isURL()
    .withMessage('Repository URL must be a valid URL.'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean.'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer.')
];

const projectUpdateValidation = [
  param('id').isUUID().withMessage('Project ID must be a valid UUID.'),
  ...projectCreateValidation
];

const projectSlugValidation = [
  param('slug')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Slug is required.')
];

const projectListValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20.'),
  query('featured').optional().isBoolean().withMessage('Featured must be a boolean.'),
  query('search').optional().isString().withMessage('Search must be a string.')
];

module.exports = {
  projectCreateValidation,
  projectUpdateValidation,
  projectSlugValidation,
  projectListValidation
};
