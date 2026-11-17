const express = require('express');
const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const serviceRequestRoutes = require('./serviceRequestRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy.',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/service-requests', serviceRequestRoutes);

module.exports = router;
