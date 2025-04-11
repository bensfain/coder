const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// GET all projects with pagination
router.get('/', authenticate, projectController.getAllProjects);

// POST create new project
router.post('/',
    authenticate,
    authorize(['admin', 'researcher']),
    projectController.createProject
);

// GET project details
router.get('/:projectId', authenticate, projectController.getProjectById);

module.exports = router;