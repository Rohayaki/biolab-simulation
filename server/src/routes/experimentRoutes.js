const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');

// GET /experiments
router.get('/experiments', experimentController.getExperiments);

// GET /experiments/:id
router.get('/experiments/:id', experimentController.getExperimentById);

module.exports = router;
