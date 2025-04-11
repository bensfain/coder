const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// GET all members of a project
router.get('/:projectId/members',
    authenticate,
    memberController.getProjectMembers
);

// PUT update a project member
router.put('/:projectId/members/:userId',
    authenticate,
    authorize(['admin', 'researcher']),
    memberController.updateProjectMember
);

module.exports = router;