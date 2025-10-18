const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();

// Models
const User = require("./models/User");
const Patient = require("./models/Patient");
const Consultant = require("./models/Consultant");
const Booking = require("./models/Booking");
const OTP = require("./models/OTP");

// Services
const { createOTP, verifyOTP, sendOTPEmail, sendOTPSMS } = require("./utils/otpService");

// Configure mongoose settings (removed deprecated options for newer mongoose versions)

// MongoDB connection with improved error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/puthuyir_care';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Please ensure MongoDB is running on your system.');
    console.log('You can start MongoDB with: mongod');
    process.exit(1);
  }
};

// Connect to database
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: true,
  cookie: { 
    maxAge: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

require("./utils/passportGoogle")(passport);

// Middleware to check token expiration
const checkTokenExpiration = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();
  
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Session expired", expired: true });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Apply token expiration check to protected routes
app.use('/api/profile', checkTokenExpiration);
app.use('/api/book', checkTokenExpiration);
app.use('/api/bookings', checkTokenExpiration);

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      
      if (user.needsVerification) {
        // User needs account verification - redirect to OTP verification
        const tempToken = jwt.sign(
          { 
            userId: user._id, 
            name: user.full_name, 
            email: user.email,
            temp: true,
            isNewUser: !user.account_verified
          },
          process.env.JWT_SECRET,
          { expiresIn: "10m" }
        );
        
        res.redirect(`http://localhost:5173/auth/verify-oauth?temp_token=${tempToken}&email=${encodeURIComponent(user.email)}&new_user=${!user.account_verified}`);
      } else {
        // Verified user - direct login
        const token = jwt.sign(
          { 
            userId: user._id, 
            name: user.full_name, 
            email: user.email 
          },
          process.env.JWT_SECRET,
          { expiresIn: "3h" }
        );
        
        // Check if profile is complete
        const profileComplete = user.profile_completed;
        
        console.log(`📋 Profile completion check for ${user.full_name}:`, {
          profileCompletedFlag: user.profile_completed,
          finalResult: profileComplete
        });
        
        if (profileComplete) {
          res.redirect(`http://localhost:5173/signin?token=${token}&name=${encodeURIComponent(user.full_name)}`);
        } else {
          res.redirect(`http://localhost:5173/signin?token=${token}&name=${encodeURIComponent(user.full_name)}&redirect=profile`);
        }
      }
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect(`http://localhost:5173/signin?error=oauth_failed`);
    }
  }
);

// Verify OAuth OTP for new users
app.post("/api/auth/verify-oauth-otp", async (req, res) => {
  try {
    const { temp_token, otp, email } = req.body;
    
    if (!temp_token || !otp || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify temp token
    const decoded = jwt.verify(temp_token, process.env.JWT_SECRET);
    if (!decoded.temp || !decoded.isNewUser) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    // Verify OTP
    await verifyOTP(email, otp, "account_verification");
    
    // Update user as verified
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    user.is_verified = true;
    user.account_verified = true; // Set account verification flag
    await user.save();
    
    // Generate final token
    const token = jwt.sign(
      { 
        userId: user._id, 
        name: user.full_name, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );
    
    // Check if profile is complete and password setup status
    const profileComplete = user.profile_completed;
    
    res.json({
      token,
      name: user.full_name,
      user_id: user._id,
      profileComplete,
      passwordSetupRequired: user.password_setup_required && !user.password_setup_completed,
      hasPassword: user.has_password
    });
  } catch (error) {
    console.error("OAuth OTP verification error:", error);
    res.status(400).json({ error: error.message || "OTP verification failed" });
  }
});

// Resend OAuth OTP
app.post("/api/auth/resend-oauth-otp", async (req, res) => {
  try {
    const { temp_token, email } = req.body;
    
    if (!temp_token || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify temp token
    const decoded = jwt.verify(temp_token, process.env.JWT_SECRET);
    if (!decoded.temp) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Send new OTP
    const otp = await createOTP(email, "account_verification");
    await sendOTPEmail(email, otp, "account_verification");
    
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Resend OAuth OTP error:", error);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if account is locked
    if (user.account_locked_until && user.account_locked_until > new Date()) {
      const lockTimeRemaining = Math.ceil((user.account_locked_until - new Date()) / (1000 * 60));
      return res.status(423).json({ 
        error: `Account locked. Try again in ${lockTimeRemaining} minutes.` 
      });
    }

    // Verify password (if user has password_hash)
    if (user.password_hash) {
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        // Increment login attempts
        user.login_attempts = (user.login_attempts || 0) + 1;
        
        // Lock account after 5 failed attempts
        if (user.login_attempts >= 5) {
          user.account_locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
          await user.save();
          return res.status(423).json({ 
            error: "Too many failed attempts. Account locked for 30 minutes." 
          });
        }
        
        await user.save();
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }

    // Check if user account is verified
    if (!user.account_verified) {
      // Allow unverified users to login but redirect to verification
      console.log(`🔄 Unverified account login attempt: ${email}`);
      
      // Send new OTP for account verification
      const otp = await createOTP(email, "account_verification");
      await sendOTPEmail(email, otp, "account_verification");
      
      return res.status(200).json({
        success: false,
        needsVerification: true,
        message: "Account not verified. New OTP sent to your email.",
        email: user.email,
        name: user.full_name
      });
    }

    // Reset login attempts on successful login
    user.login_attempts = 0;
    user.account_locked_until = undefined;
    user.last_login = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.full_name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    // Check if profile is complete
    const profileComplete = user.profile_completed;

    res.json({ 
      success: true,
      token, 
      name: user.full_name,
      user_id: user._id,
      profileComplete,
      passwordSetupRequired: user.password_setup_required && !user.password_setup_completed,
      hasPassword: user.has_password
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const patient = await Patient.findOne({ user_id: userId });
    
    console.log("📋 Profile GET request - Patient data:", {
      userId,
      hasPatient: !!patient,
      dateOfBirth: patient?.date_of_birth,
      dateType: typeof patient?.date_of_birth,
      fullData: patient
    });
    
    res.json(patient);
  } catch (error) {
    console.error("Profile GET error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Get user data for dashboard
app.get("/api/user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId).select('-password_hash -login_attempts -account_locked_until');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/api/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user needs to complete password setup before saving profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // If trying to complete profile but password setup is required and not completed
    if (req.body.profile_completed && user.password_setup_required && !user.password_setup_completed) {
      return res.status(400).json({ 
        error: "Password setup must be completed before saving profile",
        passwordSetupRequired: true
      });
    }

    // Validate phone number (Indian format)
    if (req.body.contact_number) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(req.body.contact_number)) {
        return res.status(400).json({ 
          error: "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)" 
        });
      }
    }

    // Validate pincode (6 digits)
    if (req.body.pincode) {
      const pincodeRegex = /^\d{6}$/;
      if (!pincodeRegex.test(req.body.pincode)) {
        return res.status(400).json({ 
          error: "Please enter a valid 6-digit pincode" 
        });
      }
    }

    // Validate emergency contact phone if provided
    if (req.body.emergency_contact_phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(req.body.emergency_contact_phone)) {
        return res.status(400).json({ 
          error: "Please enter a valid 10-digit Indian mobile number for emergency contact (starting with 6, 7, 8, or 9)" 
        });
      }
    }
    
    // Handle password update in User model if provided
    if (req.body.password) {
      const user = await User.findById(userId);
      if (user) {
        user.password_hash = req.body.password; // Will be hashed by pre-save middleware
        await user.save();
      }
      delete req.body.password; // Remove from patient data
    }
    
    // Handle email update in User model if provided
    if (req.body.email_address) {
      const user = await User.findById(userId);
      if (user) {
        user.email = req.body.email_address;
        await user.save();
      }
    }
    
    // Handle phone update in User model if provided
    if (req.body.contact_number) {
      const user = await User.findById(userId);
      if (user) {
        user.phone = req.body.contact_number;
        await user.save();
      }
    }
    
    // Update patient profile
    let patient = await Patient.findOne({ user_id: userId });
    if (!patient) {
      patient = new Patient({ user_id: userId });
    }
    
    console.log("💾 Profile POST - Date of birth received:", {
      dateOfBirth: req.body.date_of_birth,
      dateType: typeof req.body.date_of_birth,
      fullBody: req.body
    });
    
    Object.assign(patient, req.body);
    await patient.save();
    
    // Update profile_completed flag in User model if profile is marked as completed
    if (req.body.profile_completed) {
      const user = await User.findById(userId);
      if (user) {
        user.profile_completed = true;
        await user.save();
        console.log(`✅ Profile completion flag set for user: ${user.email}`);
      }
    }
    
    console.log("✅ Profile saved - Date of birth stored:", {
      dateOfBirth: patient.date_of_birth,
      dateType: typeof patient.date_of_birth
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.post("/api/book", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) return res.status(400).json({ error: "Profile incomplete" });

    const consultant = await Consultant.findOne({ name: req.body.consultant });
    if (!consultant) return res.status(404).json({ error: "Consultant not found" });

    const booking = new Booking({
      patient_id: patient._id,
      consultant_id: consultant._id,
      appointment_date: req.body.preferredDate,
      appointment_time: req.body.preferredTime,
      consultation_type: req.body.consultationType,
      symptoms: req.body.symptoms,
      patient_name: req.body.name,
      patient_email: req.body.email,
      patient_phone: req.body.phone,
    });
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

app.get("/api/bookings", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) return res.status(400).json({ error: "Profile incomplete" });

    const bookings = await Booking.find({ patient_id: patient._id })
      .populate("consultant_id", "name specialty")
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// OTP Endpoints

// Send OTP for account verification or login
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email, purpose } = req.body; // purpose: 'account_verification', 'login_verification', 'password_reset'
    
    if (!email || !purpose) {
      return res.status(400).json({ error: "Email and purpose are required" });
    }

    // Check if user exists for login verification
    if (purpose === "login_verification") {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.isAccountLocked()) {
        return res.status(423).json({ error: "Account is temporarily locked" });
      }
    }

    const otp = await createOTP(email, purpose);
    await sendOTPEmail(email, otp, purpose);

    res.json({ 
      success: true, 
      message: "OTP sent successfully",
      expires_in: "5 minutes"
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;
    
    if (!email || !otp || !purpose) {
      return res.status(400).json({ error: "Email, OTP, and purpose are required" });
    }

    await verifyOTP(email, otp, purpose);

    // Handle different purposes
    if (purpose === "account_verification") {
      const user = await User.findOneAndUpdate(
        { email }, 
        { 
          is_verified: true,
          account_verified: true // Set account verification flag
        },
        { new: true }
      );
      
      if (user) {
        // Generate JWT token for verified user
        const token = jwt.sign(
          { 
            userId: user._id, 
            name: user.full_name, 
            email: user.email 
          },
          process.env.JWT_SECRET,
          { expiresIn: "3h" }
        );
        
        // Check if profile exists and is complete
        const profileComplete = user.profile_completed;
        
        console.log(`📋 Manual signup verification - Profile check for ${user.full_name}:`, {
          profileCompletedFlag: user.profile_completed,
          finalResult: profileComplete
        });
        
        res.json({ 
          success: true, 
          message: "Account verified successfully",
          token,
          user_id: user._id,
          name: user.full_name,
          profileComplete,
          redirectTo: profileComplete ? "dashboard" : "profile"
        });
      } else {
        res.json({ 
          success: true, 
          message: "OTP verified successfully" 
        });
      }
    } else {
      res.json({ 
        success: true, 
        message: "OTP verified successfully" 
      });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Resend OTP for manual signup
app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    const { email, purpose } = req.body;
    
    if (!email || !purpose) {
      return res.status(400).json({ error: "Email and purpose are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send new OTP
    const otp = await createOTP(email, purpose);
    await sendOTPEmail(email, otp, purpose);
    
    console.log(`📧 Resent OTP for ${purpose} to ${email}`);
    
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
});

// Enhanced registration with OTP
app.post("/api/auth/register", async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;
    
    console.log(`📝 Registration attempt for email: ${email}`);
    
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "Full name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ User already exists: ${email}`);
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Check if phone number already exists (if provided)
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        console.log(`❌ Phone number already exists: ${phone}`);
        return res.status(409).json({ error: "User with this phone number already exists" });
      }
    }

    // Create user (unverified)
    const user = new User({
      full_name,
      email,
      password_hash: password, // Will be hashed by pre-save hook
      phone: phone || undefined, // Only set if provided
      is_verified: false,
      account_verified: false,
      has_password: true, // Manual signup users have password from start
      password_setup_required: false, // Manual users don't need password setup
      password_setup_completed: true // Manual users already completed password setup
    });

    console.log(`💾 Saving user to database...`);
    await user.save();
    console.log(`✅ User created successfully with ID: ${user._id}`);

    // Send verification OTP
    console.log(`📧 Creating and sending OTP...`);
    try {
      const otp = await createOTP(email, "account_verification");
      console.log(`📧 OTP created, now sending email...`);
      await sendOTPEmail(email, otp, "account_verification");
      console.log(`✅ OTP sent successfully to ${email}`);
    } catch (otpError) {
      console.error(`❌ OTP creation/sending failed:`, otpError);
      // Delete the user if OTP fails to prevent orphaned accounts
      await User.findByIdAndDelete(user._id);
      throw new Error(`Failed to send verification email: ${otpError.message}`);
    }

    res.status(201).json({ 
      success: true, 
      message: "Account created successfully! Please check your email for verification.",
      user_id: user._id,
      email: user.email,
      name: user.full_name
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'email' 
        ? "User with this email already exists" 
        : "User with this phone number already exists";
      return res.status(409).json({ error: message });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    res.status(500).json({ 
      error: "Failed to create account. Please try again.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Forgot Password - Send OTP
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account found with this email address" });
    }

    // Send OTP for password reset
    const otp = await createOTP(email, "password_reset");
    await sendOTPEmail(email, otp, "password_reset");
    
    console.log(`📧 Password reset OTP sent to ${email}`);
    
    res.json({ 
      success: true, 
      message: "Password reset code sent to your email" 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to send password reset code" });
  }
});

// Verify Forgot Password OTP
app.post("/api/auth/verify-forgot-password-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Verify OTP
    await verifyOTP(email, otp, "password_reset");
    
    res.json({ 
      success: true, 
      message: "OTP verified successfully" 
    });
  } catch (error) {
    console.error("Verify forgot password OTP error:", error);
    res.status(400).json({ error: error.message || "Invalid or expired OTP" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Verify OTP without marking as used
    await verifyOTP(email, otp, "password_reset", false);

    // Get user first to trigger proper hooks
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Set new password (will be hashed by pre-save hook)
    user.password_hash = newPassword;
    user.has_password = true;
    user.password_setup_required = false;
    user.password_setup_completed = true;
    
    // Save with hooks
    await user.save();

    // Mark OTP as used
    await OTP.updateOne(
      { email, otp, purpose: "password_reset" },
      { $set: { is_used: true } }
    );

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Setup Password for OAuth Users (after OTP verification)
app.post("/api/auth/setup-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const { password, confirmPassword } = req.body;
    
    if (!password || !confirmPassword) {
      return res.status(400).json({ error: "Password and confirmation are required" });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character" 
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if user is OAuth user who needs password setup
    if (!user.password_setup_required) {
      return res.status(400).json({ error: "Password setup not required for this user" });
    }
    
    if (user.password_setup_completed) {
      return res.status(400).json({ error: "Password already set up" });
    }
    
    // Set password
    user.password_hash = password; // Will be hashed by pre-save middleware
    user.has_password = true;
    user.password_setup_completed = true;
    user.password_setup_required = false; // No longer required
    await user.save();
    
    console.log(`🔐 Password setup completed for OAuth user: ${user.email}`);
    
    res.json({ 
      success: true, 
      message: "Password set up successfully",
      hasPassword: true
    });
  } catch (error) {
    console.error("Setup password error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Failed to set up password" });
  }
});

// Change Password (for users who already have a password)
app.post("/api/auth/change-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All password fields are required" });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character" 
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Verify current password
    if (!user.has_password || !user.password_hash) {
      return res.status(400).json({ error: "No current password set" });
    }
    
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    
    // Set new password
    user.password_hash = newPassword; // Will be hashed by pre-save middleware
    await user.save();
    
    console.log(`🔐 Password changed successfully for user: ${user.email}`);
    
    res.json({ 
      success: true, 
      message: "Password changed successfully" 
    });
  } catch (error) {
    console.error("Change password error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Enhanced login with OTP verification
app.post("/api/auth/login-with-otp", async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.isAccountLocked()) {
      return res.status(423).json({ error: "Account is temporarily locked due to multiple failed attempts" });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      user.login_attempts += 1;
      if (user.login_attempts >= 5) {
        user.account_locked_until = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }
      await user.save();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If OTP is required and provided, verify it
    if (otp) {
      try {
        await verifyOTP(email, otp, "login_verification");
      } catch (otpError) {
        return res.status(400).json({ error: otpError.message });
      }
    } else {
      // Send OTP for verification
      const loginOTP = await createOTP(email, "login_verification");
      await sendOTPEmail(email, loginOTP, "login_verification");
      return res.json({ 
        otp_required: true, 
        message: "OTP sent to your email for verification" 
      });
    }

    // Reset login attempts on successful login
    user.login_attempts = 0;
    user.account_locked_until = undefined;
    user.last_login = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, name: user.full_name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.json({ 
      success: true,
      token, 
      name: user.full_name,
      user_id: user._id
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Complete OAuth verification with OTP
app.post("/api/auth/verify-oauth", async (req, res) => {
  try {
    const { temp_token, otp } = req.body;
    
    if (!temp_token || !otp) {
      return res.status(400).json({ error: "Temporary token and OTP are required" });
    }

    // Verify temp token
    const decoded = jwt.verify(temp_token, process.env.JWT_SECRET);
    if (!decoded.temp) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Verify OTP
    await verifyOTP(decoded.email, otp, "login_verification");

    // Update user login info
    const user = await User.findById(decoded.userId);
    if (user) {
      user.last_login = new Date();
      user.login_attempts = 0;
      user.account_locked_until = undefined;
      await user.save();
    }

    // Generate final token
    const token = jwt.sign(
      { userId: decoded.userId, name: decoded.name, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.json({ 
      success: true,
      token, 
      name: decoded.name,
      user_id: decoded.userId
    });
  } catch (error) {
    console.error("OAuth verification error:", error);
    res.status(400).json({ error: error.message || "Verification failed" });
  }
});

// Temporary endpoint for testing - can be removed later
app.post("/api/auth/cleanup-otps", async (req, res) => {
  try {
    const { email } = req.body;
    await OTP.deleteMany({ email, purpose: "password_reset" });
    res.json({ success: true, message: "OTPs cleaned up" });
  } catch (error) {
    res.status(500).json({ error: "Cleanup failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
