const express = require('express');
const router = express.Router();
const sampleController = require('../controllers/sampleController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// GET all samples for a project
router.get('/:projectId/samples',
    authenticate,
    sampleController.getProjectSamples
);

// DELETE a sample
router.delete('/:projectId/samples/:sampleId',
    authenticate,
    authorize(['admin', 'researcher']),
    sampleController.deleteSample
);

module.exports = router;