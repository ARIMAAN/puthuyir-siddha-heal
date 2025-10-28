const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createOTP, verifyOTP, sendOTPEmail } = require('../utils/otpService');

exports.register = async (req, res) => {
  try {
    console.log('📝 Registration request received:', { full_name: req.body.full_name, email: req.body.email, phone: req.body.phone });
    
    const { full_name, email, password, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: "Email already registered. Please sign in instead." });
    }
    
    console.log('✅ Creating new user...');
    const user = new User({ full_name, email, password_hash: password, phone });
    await user.save();
    console.log('✅ User created successfully');
    
    console.log('📧 Creating OTP...');
    const otp = await createOTP(email, "account_verification");
    console.log('✅ OTP created:', otp);
    
    console.log('📤 Sending OTP email...');
    await sendOTPEmail(email, otp, "account_verification");
    console.log('✅ OTP email sent successfully');
    
    res.status(201).json({ success: true, message: "Account created! Check email for verification." });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: "No account found with this email address" });
    }
    
    if (!await user.comparePassword(password)) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
    res.json({ success: true, token, name: user.full_name, user_id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    const otp = await createOTP(email, purpose);
    await sendOTPEmail(email, otp, purpose);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;
    console.log('🔐 OTP verification request:', { email, purpose });
    
    await verifyOTP(email, otp, purpose);
    console.log('✅ OTP verified successfully');
    
    // If this is account verification, mark user as verified and return token
    if (purpose === 'account_verification') {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Mark user as verified
      user.is_verified = true;
      user.account_verified = true;
      await user.save();
      console.log('✅ User account verified:', email);
      
      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
      
      // Return token and user info
      return res.json({ 
        success: true, 
        message: "Account verified successfully",
        token,
        name: user.full_name,
        user_id: user._id,
        redirectTo: user.profile_completed ? "dashboard" : "profile"
      });
    }
    
    // For other purposes, just return success
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error('❌ OTP verification error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not registered. Please check your email or sign up." });
    }
    
    const otp = await createOTP(email, "password_reset");
    await sendOTPEmail(email, otp, "password_reset");
    res.json({ success: true, message: "Password reset OTP sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Don't mark OTP as used yet - it will be marked as used during actual password reset
    await verifyOTP(email, otp, "password_reset", false);
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    // Verify OTP first
    await verifyOTP(email, otp, "password_reset");
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Update password
    user.password_hash = newPassword;
    user.has_password = true;
    await user.save();
    
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.setupPassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const user = await User.findById(userId);
    user.password_hash = password;
    user.has_password = true;
    user.password_setup_completed = true;
    user.password_setup_required = false;
    await user.save();
    res.json({ success: true, message: "Password set up successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/signin?token=${token}&name=${encodeURIComponent(user.full_name)}`);
  } catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/signin?error=oauth_failed`);
  }
};

exports.verifyOAuthOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyOTP(email, otp, "login_verification");
    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
    res.json({ 
      success: true, 
      token, 
      name: user.full_name, 
      user_id: user._id, 
      profileComplete: user.profile_completed 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resendOAuthOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = await createOTP(email, "login_verification");
    await sendOTPEmail(email, otp, "login_verification");
    res.json({ success: true, message: "New OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
