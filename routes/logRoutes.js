const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticate } = require('../middlewares/authMiddleware');

// GET research logs for a project
router.get('/:projectId/logs',
    authenticate,
    logController.getProjectLogs
);

module.exports = router;