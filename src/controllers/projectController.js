const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { Project } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 150);
};

const deleteImageFile = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(__dirname, '../../public', filePath.replace(/^\//, ''));

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

const getProjects = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const offset = (page - 1) * limit;
  const search = req.query.search ? String(req.query.search).trim() : '';
  const featuredOnly = req.query.featured === 'true';

  const where = {};

  if (featuredOnly) {
    where.featured = true;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { techStack: { [Op.overlap]: [search] } }
    ];
  }

  const { count, rows } = await Project.findAndCountAll({
    where,
    order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']],
    limit,
    offset
  });

  return sendResponse(res, 200, 'Projects retrieved successfully.', {
    projects: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit)
    }
  });
});

const getProjectBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const project = await Project.findOne({
    where: { slug }
  });

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  return sendResponse(res, 200, 'Project retrieved successfully.', { project });
});

const createProject = asyncHandler(async (req, res) => {
  const { title, description, longDescription, techStack, liveUrl, repoUrl, featured, displayOrder } = req.body;

  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let suffix = 1;

  while (await Project.findOne({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const project = await Project.create({
    title: title.trim(),
    slug,
    description: description.trim(),
    longDescription: longDescription.trim(),
    techStack: Array.isArray(techStack) ? techStack.map((item) => item.trim()) : [],
    imageUrl,
    liveUrl: liveUrl || null,
    repoUrl: repoUrl || null,
    featured: Boolean(featured),
    displayOrder: Number(displayOrder) || 0,
    userId: req.user.id
  });

  return sendResponse(res, 201, 'Project created successfully.', { project });
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByPk(id);

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  const { title, description, longDescription, techStack, liveUrl, repoUrl, featured, displayOrder } = req.body;

  if (title && title !== project.title) {
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let suffix = 1;

    while (await Project.findOne({ where: { slug } })) {
      if (project.slug === slug) {
        break;
      }
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    project.slug = slug;
  }

  if (title) project.title = title.trim();
  if (description) project.description = description.trim();
  if (longDescription) project.longDescription = longDescription.trim();
  if (techStack) project.techStack = Array.isArray(techStack) ? techStack.map((item) => item.trim()) : project.techStack;
  if (liveUrl !== undefined) project.liveUrl = liveUrl || null;
  if (repoUrl !== undefined) project.repoUrl = repoUrl || null;
  if (featured !== undefined) project.featured = Boolean(featured);
  if (displayOrder !== undefined) project.displayOrder = Number(displayOrder) || 0;

  if (req.file) {
    deleteImageFile(project.imageUrl);
    project.imageUrl = `/uploads/${req.file.filename}`;
  }

  await project.save();

  return sendResponse(res, 200, 'Project updated successfully.', { project });
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByPk(id);

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  deleteImageFile(project.imageUrl);
  await project.destroy();

  return sendResponse(res, 200, 'Project deleted successfully.', null);
});

module.exports = {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
};
