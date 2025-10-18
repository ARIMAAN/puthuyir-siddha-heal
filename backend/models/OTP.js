const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { 
    type: String, 
    enum: ["account_verification", "login_verification", "password_reset", "profile_update"], 
    required: true 
  },
  attempts: { type: Number, default: 0, max: 3 },
  is_used: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  expires_at: { 
    type: Date, 
    default: () => new Date(Date.now() + 5 * 60 * 1000), 
    index: { expireAfterSeconds: 0 }
  }
});

otpSchema.index({ email: 1, purpose: 1, is_used: 1 });

module.exports = mongoose.model("OTP", otpSchema);
