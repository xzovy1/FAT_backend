const express = require('express');
const router = express.Router();
const { getDashboard, getMetrics } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth.js');

// Protected dashboard routes
router.get('/', authenticateToken, getDashboard);
router.get('/metrics', authenticateToken, getMetrics);

module.exports = router;