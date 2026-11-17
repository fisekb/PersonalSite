const express = require('express');
const {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const authenticate = require('../middlewares/authenticate');
const authorizeRole = require('../middlewares/authorizeRole');
const upload = require('../middlewares/upload');
const validate = require('../middlewares/validate');
const {
  projectCreateValidation,
  projectUpdateValidation,
  projectSlugValidation,
  projectListValidation
} = require('../validators/projectValidator');

const router = express.Router();

router.get('/', projectListValidation, validate, getProjects);
router.get('/:slug', projectSlugValidation, validate, getProjectBySlug);

router.post(
  '/',
  authenticate,
  authorizeRole('admin'),
  upload.single('image'),
  projectCreateValidation,
  validate,
  createProject
);

router.put(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  upload.single('image'),
  projectUpdateValidation,
  validate,
  updateProject
);

router.delete(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  projectUpdateValidation,
  validate,
  deleteProject
);

module.exports = router;
