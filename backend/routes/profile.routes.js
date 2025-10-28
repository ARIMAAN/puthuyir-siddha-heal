const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { checkAuth } = require('../middleware/auth.middleware');

router.get('/', checkAuth, profileController.getProfile);
router.post('/', checkAuth, profileController.updateProfile);

module.exports = router;
