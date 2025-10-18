const OTP = require("../models/OTP");
const crypto = require("crypto");

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Create and save OTP
const createOTP = async (email, purpose) => {
  try {
    console.log(`🔄 Creating OTP for ${email} with purpose: ${purpose}`);
    
    // Validate inputs
    if (!email || !purpose) {
      throw new Error("Email and purpose are required for OTP creation");
    }

    // Invalidate any existing OTPs for this email and purpose
    const updateResult = await OTP.updateMany(
      { email, purpose, is_used: false },
      { is_used: true }
    );
    console.log(`📝 Invalidated ${updateResult.modifiedCount} existing OTPs`);

    const otp = generateOTP();
    const otpDoc = new OTP({
      email: email.toLowerCase().trim(),
      otp,
      purpose,
      expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0,
      is_used: false
    });

    console.log(`💾 Saving OTP to database...`);
    try {
      const savedOTP = await otpDoc.save();
      console.log(`✅ OTP saved successfully with ID: ${savedOTP._id}`);
      console.log(`📧 Generated OTP: ${otp} for ${email} (${purpose})`);
      
      return otp;
    } catch (saveError) {
      console.error(`❌ Failed to save OTP to database:`, saveError);
      throw new Error(`Database save failed: ${saveError.message}`);
    }
  } catch (error) {
    console.error(`❌ Failed to create OTP for ${email}:`, error);
    throw new Error(`Failed to create OTP: ${error.message}`);
  }
};

// Verify OTP
const verifyOTP = async (email, otp, purpose, markAsUsed = true) => {
  try {
    const otpDoc = await OTP.findOne({
      email,
      otp,
      purpose,
      expires_at: { $gt: new Date() } // Only check expiration here
    });

    if (!otpDoc) {
      throw new Error("Invalid or expired OTP");
    }

    if (otpDoc.is_used && markAsUsed) {
      throw new Error("OTP has already been used");
    }

    // Mark as used if requested
    if (markAsUsed) {
      otpDoc.is_used = true;
      await otpDoc.save();
    }

    return true;
  } catch (error) {
    throw error;
  }
};

// Send OTP via email using nodemailer
const sendOTPEmail = async (email, otp, purpose) => {
  const nodemailer = require('nodemailer');
  
  try {
    // Check if SMTP configuration exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('⚠️ SMTP configuration missing, using console fallback');
      throw new Error('SMTP configuration not found');
    }

    // Create transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,    // 5 seconds
      socketTimeout: 10000      // 10 seconds
    });

    // Email content based on purpose
    let subject, htmlContent;
    
    switch (purpose) {
      case 'account_verification':
        subject = 'Verify Your Puthuyir Account';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to Puthuyir!</h2>
            <p>Thank you for creating an account with us. Please verify your email address using the OTP below:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <p>If you didn't create an account with Puthuyir, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Puthuyir Healthcare Team</p>
          </div>
        `;
        break;
        
      case 'login_verification':
        subject = 'Puthuyir Login Verification';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Login Verification Required</h2>
            <p>We detected a login attempt to your Puthuyir account. Please use the OTP below to complete your login:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <p>If you didn't attempt to login, please secure your account immediately.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Puthuyir Healthcare Team</p>
          </div>
        `;
        break;
        
      case 'password_reset':
        subject = 'Reset Your Puthuyir Password';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Password Reset Request</h2>
            <p>You requested to reset your Puthuyir account password. Use the OTP below to proceed:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Puthuyir Healthcare Team</p>
          </div>
        `;
        break;
        
      case 'profile_update':
        subject = 'Puthuyir Profile Update Verification';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Profile Update Verification</h2>
            <p>You are attempting to update sensitive information in your Puthuyir profile. Please use the OTP below to verify this change:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP is valid for <strong>5 minutes</strong> and has a maximum of <strong>3 attempts</strong>.</p>
            <p>If you didn't attempt to update your profile, please secure your account immediately.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Puthuyir Healthcare Team</p>
          </div>
        `;
        break;
        
      default:
        subject = 'Puthuyir Verification Code';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Verification Required</h2>
            <p>Please use the following OTP to complete your verification:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Puthuyir Healthcare Team</p>
          </div>
        `;
    }

    // Send email with timeout
    const emailPromise = transporter.sendMail({
      from: `"Puthuyir Healthcare" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent
    });

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timeout')), 10000); // 10 second timeout
    });

    const info = await Promise.race([emailPromise, timeoutPromise]);

    console.log(`📧 OTP Email sent successfully to ${email} (Message ID: ${info.messageId})`);
    return true;
    
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    console.error('📋 Email error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      message: error.message
    });
    
    // Fallback to console logging if email fails
    console.log(`📧 FALLBACK - OTP Email to ${email}:`);
    console.log(`Purpose: ${purpose}`);
    console.log(`OTP: ${otp}`);
    console.log(`Valid for 5 minutes`);
    
    // In development, we continue even if email fails
    // In production, you might want to throw an error
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to send verification email. Please try again.');
    }
    
    return true;
  }
};

// Send OTP via SMS (mock implementation - replace with actual SMS service)
const sendOTPSMS = async (phone, otp, purpose) => {
  // TODO: Integrate with actual SMS service (Twilio, AWS SNS, etc.)
  console.log(`📱 OTP SMS to ${phone}:`);
  console.log(`Purpose: ${purpose}`);
  console.log(`OTP: ${otp}`);
  console.log(`Valid for 5 minutes`);
  
  // Mock successful send
  return true;
};

// Clean up expired OTPs (can be run as a cron job)
const cleanupExpiredOTPs = async () => {
  try {
    const result = await OTP.deleteMany({
      expires_at: { $lt: new Date() }
    });
    console.log(`Cleaned up ${result.deletedCount} expired OTPs`);
    return result.deletedCount;
  } catch (error) {
    console.error("Error cleaning up expired OTPs:", error);
    throw error;
  }
};

module.exports = {
  generateOTP,
  createOTP,
  verifyOTP,
  sendOTPEmail,
  sendOTPSMS,
  cleanupExpiredOTPs
};
