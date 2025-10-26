const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
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

// Helper to get frontend and backend URLs from env
const FRONTEND_BASE_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_BASE_URL = process.env.BACKEND_URL || "http://localhost:5000";

// Update CORS configuration to allow only the deployed frontend and localhost for dev
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://puthuyir-siddha-medicine.vercel.app',
  'http://localhost:5173'
];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests for all routes
app.options('*', cors());

app.use(bodyParser.json());
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: { 
    maxAge: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

require("./utils/passportGoogle")(passport);

// Utility function to generate booking token
const generateBookingToken = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `BK${timestamp}${random}`.toUpperCase();
};

// Middleware to check token expiration and validity
const checkTokenExpiration = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request for use in routes
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Apply token expiration check to protected routes
app.use('/api/profile', checkTokenExpiration);
app.use('/api/book', checkTokenExpiration);
app.use('/api/bookings', checkTokenExpiration);
app.use('/api/user', checkTokenExpiration);

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
        
        res.redirect(`${FRONTEND_BASE_URL}/auth/verify-oauth?temp_token=${tempToken}&email=${encodeURIComponent(user.email)}&new_user=${!user.account_verified}`);
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
          res.redirect(`${FRONTEND_BASE_URL}/signin?token=${token}&name=${encodeURIComponent(user.full_name)}`);
        } else {
          res.redirect(`${FRONTEND_BASE_URL}/signin?token=${token}&name=${encodeURIComponent(user.full_name)}&redirect=profile`);
        }
      }
    } catch (error) {
      console.error("OAuth callback error:", error); // Log the error
      res.redirect(`${FRONTEND_BASE_URL}/signin?error=oauth_failed`);
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
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const patient = await Patient.findOne({ user_id: req.userId });
    
    console.log("📋 Profile GET request - Patient data:", {
      userId: req.userId,
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
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const user = await User.findById(req.userId).select('-password_hash -login_attempts -account_locked_until');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/api/profile", async (req, res) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Check if user needs to complete password setup before saving profile
    const user = await User.findById(req.userId);
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
      const user = await User.findById(req.userId);
      if (user) {
        user.password_hash = req.body.password; // Will be hashed by pre-save middleware
        await user.save();
      }
      delete req.body.password; // Remove from patient data
    }
    
    // Handle email update in User model if provided
    if (req.body.email_address) {
      const user = await User.findById(req.userId);
      if (user) {
        user.email = req.body.email_address;
        await user.save();
      }
    }
    
    // Handle phone update in User model if provided
    if (req.body.contact_number) {
      const user = await User.findById(req.userId);
      if (user) {
        user.phone = req.body.contact_number;
        await user.save();
      }
    }
    
    // Update patient profile
    let patient = await Patient.findOne({ user_id: req.userId });
    if (!patient) {
      patient = new Patient({ user_id: req.userId });
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
      const user = await User.findById(req.userId);
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
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
  const nodemailer = require('nodemailer');

  try {
    const patient = await Patient.findOne({ user_id: req.userId });
    if (!patient) return res.status(400).json({ error: "Profile incomplete" });

    // Get user email for sending emails
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let consultant = await Consultant.findOne({ name: req.body.consultant });
    if (!consultant) {
      // Create the consultant if she doesn't exist
      const newConsultant = new Consultant({
        name: req.body.consultant,
        specialization: "Siddha Medicine",
        about: "Experienced Siddha practitioner specializing in traditional healing methods"
      });
      await newConsultant.save();
      consultant = newConsultant;
    }

    // Generate a booking token for rescheduling purposes
    const bookingToken = generateBookingToken();
    const tokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const booking = new Booking({
      patient_id: patient._id,
      consultant_id: consultant._id,
      appointment_date: req.body.preferredDate,
      symptoms: req.body.symptoms,
      patient_name: req.body.name,
      patient_email: req.body.email,
      patient_phone: req.body.phone,
      token: bookingToken,
      token_expires_at: tokenExpiresAt,
      is_token_booking: true
    });
    await booking.save();

    // Prepare email templates
    const patientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">✅ Appointment Booked Successfully!</h2>
        <p>Dear <strong>${patient.full_name}</strong>,</p>
        <p>Your online consultation appointment has been successfully booked with <strong>${consultant.name}</strong>.</p>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="margin-top: 0; color: #0ea5e9;">📋 Appointment Details:</h3>
          <p><strong>👨‍⚕️ Consultant:</strong> ${consultant.name}</p>
          <p><strong>📅 Date & Time:</strong> ${new Date(req.body.preferredDate).toLocaleString()}</p>
          <p><strong>🩺 Symptoms:</strong> ${req.body.symptoms}</p>
          <p><strong>🔑 Booking Token:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${bookingToken}</code></p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0;"><strong>📞 Next Steps:</strong> Our consultant will contact you shortly to confirm the appointment and discuss your health concerns.</p>
        </div>

        <p>You can use the booking token above to reschedule your appointment if needed (valid for 30 days).</p>

        <p>Thank you for choosing Puthuyir Healthcare for your traditional Siddha medicine consultation!</p>

        <p>Best regards,<br><strong>Puthuyir Healthcare Team</strong></p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <div style="text-align: center; color: #9ca3af; font-size: 12px;">
          <p>Puthuyir Healthcare | Traditional Siddha Medicine</p>
          <p>For urgent matters, please call us directly.</p>
        </div>
      </div>
    `;

    const consultantEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🔔 New Appointment Booking</h2>
        <p>Hello <strong>${consultant.name}</strong>,</p>
        <p>You have a new online consultation appointment scheduled.</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #1f2937;">👤 Patient Information:</h3>
          <p><strong>👤 Name:</strong> ${patient.full_name}</p>
          <p><strong>📧 Email:</strong> <a href="mailto:${user.email}" style="color: #2563eb;">${user.email}</a></p>
          <p><strong>📱 Phone:</strong> ${req.body.phone || 'Not provided'}</p>
          <p><strong>📅 Appointment Date:</strong> ${new Date(req.body.preferredDate).toLocaleString()}</p>
          <p><strong>🩺 Symptoms/Concerns:</strong> ${req.body.symptoms}</p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0;"><strong>⚡ Action Required:</strong> Please contact the patient to confirm the appointment and prepare for the consultation.</p>
        </div>

        <p>You can respond to the patient directly using their email address above.</p>

        <p>Best regards,<br><strong>Puthuyir Healthcare System</strong></p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <div style="text-align: center; color: #9ca3af; font-size: 12px;">
          <p>Puthuyir Healthcare | Traditional Siddha Medicine</p>
        </div>
      </div>
    `;

    // Send emails if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Send patient confirmation email
      try {
        await transporter.sendMail({
          from: `"Puthuyir Healthcare" <${process.env.SMTP_USER}>`,
          to: user.email, // Use user.email instead of patient.email
          subject: '✅ Appointment Booked - Puthuyir Healthcare',
          html: patientEmailHtml
        });
        console.log(`✅ Patient confirmation email sent to ${user.email}`);
      } catch (patientEmailError) {
        console.error('❌ Failed to send patient confirmation email:', patientEmailError);
      }

      // Send consultant notification email
      try {
        // For now, send to admin email as consultant email. In production, you'd have consultant emails in the database
        if (process.env.CONTACT_RECEIVER) {
          await transporter.sendMail({
            from: `"Puthuyir Healthcare" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_RECEIVER, // Using admin email for now
            subject: `🔔 New Appointment: ${patient.full_name} - ${consultant.name}`,
            html: consultantEmailHtml
          });
          console.log(`✅ Consultant notification sent to ${process.env.CONTACT_RECEIVER}`);
        }
      } catch (consultantEmailError) {
        console.error('❌ Failed to send consultant notification email:', consultantEmailError);
      }
    }

    res.json({
      success: true,
      booking: {
        ...booking.toObject(),
        token: bookingToken
      },
      message: "Appointment booked successfully! Confirmation emails have been sent.",
      emails: {
        patient: "Confirmation sent to patient",
        consultant: "Notification sent to consultant"
      }
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

app.get("/api/bookings", async (req, res) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const patient = await Patient.findOne({ user_id: req.userId });
    if (!patient) return res.status(400).json({ error: "Profile incomplete" });

    const bookings = await Booking.find({ patient_id: patient._id })
      .populate("consultant_id", "name specialty")
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error("Bookings fetch error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});
app.post("/api/booking/reschedule", async (req, res) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { bookingToken, newDate } = req.body;

    if (!bookingToken || !newDate) {
      return res.status(400).json({ error: "Booking token and new date are required" });
    }

    // Find the booking by token
    const booking = await Booking.findOne({
      token: bookingToken,
      patient_id: await Patient.findOne({ user_id: req.userId }).then(p => p._id),
      token_expires_at: { $gt: new Date() }
    });

    if (!booking) {
      return res.status(404).json({ error: "Invalid or expired booking token" });
    }

    // Update the appointment date
    booking.appointment_date = new Date(newDate);
    booking.status = "booked"; // Reset status if it was changed
    await booking.save();

    res.json({
      success: true,
      booking: booking,
      message: "Appointment rescheduled successfully"
    });
  } catch (error) {
    console.error("Reschedule booking error:", error);
    res.status(500).json({ error: "Failed to reschedule booking" });
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

// Contact form endpoint - sends emails directly without database storage
app.post("/api/contact", async (req, res) => {
  const nodemailer = require('nodemailer');

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    // Check if SMTP configuration exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('❌ SMTP configuration missing in .env file');
      return res.status(500).json({ error: "Email service not configured. Please contact support." });
    }

    // Create transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,    // 5 seconds
      socketTimeout: 10000      // 10 seconds
    });

    // Prepare email content for admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🔔 New Contact Form Submission</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <p><strong>👤 Name:</strong> ${name}</p>
          <p><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
          <p><strong>📝 Subject:</strong> ${subject || 'No subject provided'}</p>
          <p><strong>💬 Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p><strong>🕒 Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0;"><strong>⚡ Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; text-align: center;">Puthuyir Contact Management System</p>
      </div>
    `;

    // Prepare confirmation email for user
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">✅ Thank You for Contacting Puthuyir!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for reaching out to us! We have received your message and our team will get back to you within <strong>24-48 hours</strong>.</p>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="margin-top: 0; color: #0ea5e9;">📋 Your Message Summary:</h3>
          <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          <p><strong>Message Preview:</strong></p>
          <p style="font-style: italic; color: #374151;">"${message.length > 150 ? message.substring(0, 150) + '...' : message}"</p>
        </div>

        <p>If you have any <strong>urgent concerns</strong>, please don't hesitate to call us directly at our contact number.</p>

        <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #6b7280;">💡 <strong>Quick Tip:</strong> For faster response, include your phone number in future messages.</p>
        </div>

        <p>Best regards,<br><strong>Puthuyir Healthcare Team</strong></p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <div style="text-align: center; color: #9ca3af; font-size: 12px;">
          <p>📧 This is an automated response. Please do not reply to this email.</p>
          <p>Puthuyir Healthcare | Traditional Siddha Medicine</p>
        </div>
      </div>
    `;

    // Send admin notification email
    try {
      await transporter.sendMail({
        from: `"Puthuyir Contact System" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_RECEIVER,
        subject: `📧 Contact Form: ${subject || 'New Message'} - ${name}`,
        html: adminEmailHtml,
        replyTo: email // Allow admin to reply directly to user
      });
      console.log(`✅ Admin notification sent to ${process.env.CONTACT_RECEIVER}`);
    } catch (adminEmailError) {
      console.error('❌ Failed to send admin notification:', adminEmailError);
      return res.status(500).json({ error: "Failed to send notification. Please try again or contact support directly." });
    }

    // Send confirmation email to user
    try {
      await transporter.sendMail({
        from: `"Puthuyir Healthcare" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '✅ Thank you for contacting Puthuyir - We received your message',
        html: userEmailHtml
      });
      console.log(`✅ Confirmation email sent to ${email}`);
    } catch (userEmailError) {
      console.error('❌ Failed to send confirmation email:', userEmailError);
      // Don't fail the request if confirmation email fails, admin email already sent
      console.log('⚠️ Admin notified but user confirmation failed - continuing');
    }

    console.log(`📧 Contact form processed successfully:`, {
      name,
      email,
      subject: subject || 'No subject',
      messageLength: message.length,
      adminNotified: true,
      userNotified: true,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: "Thank you for your message! We have received it and will get back to you within 24-48 hours.",
      emails: {
        admin: "Notification sent to support team",
        confirmation: "Confirmation sent to your email"
      }
    });

  } catch (error) {
    console.error("❌ Contact form error:", error);
    res.status(500).json({
      error: "Failed to send message. Please try again or contact us directly.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Global error handler for unhandled exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Exit the process to avoid undefined behavior
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
