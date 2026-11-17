const express = require('express');
const {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateStatus,
  deleteServiceRequest,
  getStats
} = require('../controllers/serviceRequestController');
const authenticate = require('../middlewares/authenticate');
const authorizeRole = require('../middlewares/authorizeRole');
const validate = require('../middlewares/validate');
const { serviceRequestLimiter } = require('../middlewares/rateLimiter');
const {
  serviceRequestCreateValidation,
  serviceRequestUpdateStatusValidation,
  serviceRequestListValidation,
  serviceRequestByIdValidation
} = require('../validators/serviceRequestValidator');

const router = express.Router();

router.post(
  '/',
  serviceRequestLimiter,
  serviceRequestCreateValidation,
  validate,
  createServiceRequest
);

router.get(
  '/',
  authenticate,
  authorizeRole('admin'),
  serviceRequestListValidation,
  validate,
  getServiceRequests
);

router.get(
  '/stats',
  authenticate,
  authorizeRole('admin'),
  getStats
);

router.get(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  serviceRequestByIdValidation,
  validate,
  getServiceRequestById
);

router.patch(
  '/:id/status',
  authenticate,
  authorizeRole('admin'),
  serviceRequestUpdateStatusValidation,
  validate,
  updateStatus
);

router.delete(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  serviceRequestByIdValidation,
  validate,
  deleteServiceRequest
);

module.exports = router;
