const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/auth.middleware');
const bookingController = require('../controllers/booking.controller');

// Debug middleware
router.use((req, res, next) => {
  console.log(`🔍 Booking route hit: ${req.method} ${req.originalUrl}`);
  next();
});

// Test endpoint without auth
router.get('/test', (req, res) => {
  console.log('✅ Test endpoint hit!');
  res.json({ success: true, message: 'Booking routes are working!' });
});

// @route   GET /api/bookings
// @desc    Get all bookings for the logged-in user
// @access  Private
router.get('/', checkAuth, bookingController.getBookings);

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', checkAuth, bookingController.createBooking);

module.exports = router;
