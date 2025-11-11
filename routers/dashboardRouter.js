const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth.js');

// Protected dashboard routes
router.get('/', authenticateToken, dashboardController.getDashboard);
router.get('/metrics', authenticateToken, dashboardController.getMetrics);

router.post('/createJobNumber', dashboardController.createJobNumber)

module.exports = router;