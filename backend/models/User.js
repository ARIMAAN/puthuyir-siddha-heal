const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password_hash: String,
  has_password: { type: Boolean, default: false }, 
  password_setup_required: { type: Boolean, default: false }, // For OAuth users who need to set password
  password_setup_completed: { type: Boolean, default: false }, // Track if OAuth user has set password
  phone: { type: String, unique: true, sparse: true },
  is_verified: { type: Boolean, default: false },
  account_verified: { type: Boolean, default: false }, // Overall account verification status
  profile_completed: { type: Boolean, default: false }, // Track if user has completed their profile
  oauth_provider: { type: String, enum: ["google", "facebook", null], default: null },
  oauth_id: String,
  profile_picture: String,
  first_name: String,
  last_name: String,
  google_profile: {
    id: String,
    displayName: String,
    photos: [{ value: String }],
    locale: String,
    verified_email: Boolean
  },
  last_login: Date,
  login_attempts: { type: Number, default: 0 },
  account_locked_until: Date,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  role: { type: String, enum: ["client", "consultant", "admin"], default: "client" }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password_hash') && this.password_hash) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password_hash = await bcrypt.hash(this.password_hash, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password_hash) return false;
  return bcrypt.compare(candidatePassword, this.password_hash);
};

userSchema.methods.isAccountLocked = function() {
  return this.account_locked_until && this.account_locked_until > Date.now();
};

module.exports = mongoose.model("User", userSchema);
