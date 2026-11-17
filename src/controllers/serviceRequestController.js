const { Op } = require('sequelize');
const { ServiceRequest, Project } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { sendNewServiceRequestEmail } = require('../utils/mailer');

const createServiceRequest = asyncHandler(async (req, res) => {
  const { name, email, phone, serviceType, budgetRange, message } = req.body;

  const request = await ServiceRequest.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : null,
    serviceType,
    budgetRange: budgetRange ? budgetRange.trim() : null,
    message: message.trim()
  });

  try {
    await sendNewServiceRequestEmail(request.toJSON());
  } catch (error) {
    console.error('Email notification failed:', error.message);
  }

  return sendResponse(res, 201, 'Service request submitted successfully.', { request });
});

const getServiceRequests = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status || null;

  const where = {};

  if (status) {
    where.status = status;
  }

  const { count, rows } = await ServiceRequest.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });

  return sendResponse(res, 200, 'Service requests retrieved successfully.', {
    requests: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit)
    }
  });
});

const getServiceRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await ServiceRequest.findByPk(id);

  if (!request) {
    throw new ApiError(404, 'Service request not found.');
  }

  return sendResponse(res, 200, 'Service request retrieved successfully.', { request });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const request = await ServiceRequest.findByPk(id);

  if (!request) {
    throw new ApiError(404, 'Service request not found.');
  }

  request.status = status;
  await request.save();

  return sendResponse(res, 200, 'Service request status updated successfully.', { request });
});

const deleteServiceRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await ServiceRequest.findByPk(id);

  if (!request) {
    throw new ApiError(404, 'Service request not found.');
  }

  await request.destroy();

  return sendResponse(res, 200, 'Service request deleted successfully.', null);
});

const getStats = asyncHandler(async (req, res) => {
  const [projectCount, requestCount, newRequestCount] = await Promise.all([
    Project.count(),
    ServiceRequest.count(),
    ServiceRequest.count({ where: { status: 'new' } })
  ]);

  return sendResponse(res, 200, 'Service request stats retrieved successfully.', {
    totalProjects: projectCount,
    totalRequests: requestCount,
    newRequests: newRequestCount
  });
});

module.exports = {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateStatus,
  deleteServiceRequest,
  getStats
};
