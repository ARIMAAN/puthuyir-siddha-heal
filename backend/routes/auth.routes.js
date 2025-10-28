const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { checkAuth } = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-forgot-password-otp', authController.verifyForgotPasswordOTP);
router.post('/reset-password', authController.resetPassword);
router.post('/setup-password', checkAuth, authController.setupPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { 
  failureRedirect: '/signin?error=oauth_failed',
  session: false 
}), authController.googleCallback);

router.post('/verify-oauth-otp', authController.verifyOAuthOTP);
router.post('/resend-oauth-otp', authController.resendOAuthOTP);

module.exports = router;
