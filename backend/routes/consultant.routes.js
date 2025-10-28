const express = require('express');
const router = express.Router();
const consultantController = require('../controllers/consultant.controller');

// @route   GET /api/consultants
// @desc    Get all consultants
// @access  Public
router.get('/', consultantController.getConsultants);

module.exports = router;
