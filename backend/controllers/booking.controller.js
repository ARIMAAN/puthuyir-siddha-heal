const Booking = require('../models/Booking');
const Patient = require('../models/Patient');
const Consultant = require('../models/Consultant');
const { getPatientEmailHtml, getConsultantEmailHtml, getAdminEmailHtml } = require('../utils/emailTemplates');
const nodemailer = require('nodemailer');

// Ensure there's at least one consultant available for bookings
const ensureDefaultConsultant = async () => {
  const existingConsultant = await Consultant.findOne({});
  if (existingConsultant) {
    return existingConsultant;
  }

  const defaultConsultantData = {
    name: process.env.DEFAULT_CONSULTANT_NAME || 'Puthuyir Healthcare Team',
    specialization: process.env.DEFAULT_CONSULTANT_SPECIALIZATION || 'General Siddha Consultation',
    about: 'Auto-generated consultant to ensure bookings always succeed.',
    email: process.env.CONTACT_RECEIVER || process.env.SMTP_USER || undefined,
  };

  const createdConsultant = new Consultant(defaultConsultantData);
  return createdConsultant.save();
};

// Send booking confirmation emails
const sendBookingEmails = async (bookingData) => {
  try {
    // Check if SMTP configuration exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('⚠️ SMTP configuration missing, skipping email notifications');
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    // Send email to patient
    try {
      await transporter.sendMail({
        from: `"Puthuyir Healthcare" <${process.env.SMTP_USER}>`,
        to: bookingData.patient.email,
        subject: '✅ Appointment Booked Successfully - Puthuyir Healthcare',
        html: getPatientEmailHtml(bookingData)
      });
      console.log(`📧 Booking confirmation email sent to patient: ${bookingData.patient.email}`);
    } catch (error) {
      console.error('❌ Failed to send email to patient:', error.message);
    }

    // Send email to consultant/doctor
    if (bookingData.consultant.email) {
      try {
        await transporter.sendMail({
          from: `"Puthuyir Healthcare System" <${process.env.SMTP_USER}>`,
          to: bookingData.consultant.email,
          subject: '🔔 New Appointment Booking - Puthuyir Healthcare',
          html: getConsultantEmailHtml(bookingData)
        });
        console.log(`📧 Booking notification email sent to doctor: ${bookingData.consultant.email}`);
      } catch (error) {
        console.error('❌ Failed to send email to doctor:', error.message);
      }
    } else {
      console.log('⚠️ Doctor email not available, skipping doctor notification');
    }

    // Send email to admin
    const adminEmail = process.env.CONTACT_RECEIVER || process.env.SMTP_USER;
    if (adminEmail) {
      try {
        await transporter.sendMail({
          from: `"Puthuyir System Alert" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: '📢 New Booking Alert - Puthuyir Healthcare',
          html: getAdminEmailHtml(bookingData)
        });
        console.log(`📧 Booking alert sent to admin: ${adminEmail}`);
      } catch (error) {
        console.error('❌ Failed to send email to admin:', error.message);
      }
    } else {
      console.log('⚠️ Admin email not configured, skipping admin notification');
    }

  } catch (error) {
    console.error('❌ Error in sendBookingEmails:', error.message);
  }
};

// Get all bookings for the logged-in user
exports.getBookings = async (req, res) => {
  try {
    console.log('getBookings called for userId:', req.userId);
    
    // Validate userId exists
    if (!req.userId) {
      console.error('No userId found in request');
      return res.status(401).json({ error: 'Unauthorized - No user ID' });
    }

    // Find patient by user_id
    const patient = await Patient.findOne({ user_id: req.userId });
    console.log('Patient found:', patient ? patient._id : 'none');
    
    if (!patient) {
      // Return empty array if patient profile doesn't exist yet
      console.log('No patient profile found, returning empty array');
      return res.json([]);
    }

    // Fetch bookings without populate to avoid errors with missing consultant references
    const bookings = await Booking.find({ patient_id: patient._id });
    console.log('Bookings found:', bookings.length);
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    let { consultant_id, appointment_date, symptoms, patient_name, patient_email, patient_phone } = req.body;

    // Find patient by user_id
    const patient = await Patient.findOne({ user_id: req.userId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found. Please complete your profile first.' });
    }

    let consultant;

    // If no consultant_id provided, use or create the default consultant
    if (!consultant_id) {
      consultant = await ensureDefaultConsultant();
      consultant_id = consultant._id;
      console.log('📝 Using fallback consultant:', consultant.name);
    } else {
      console.log('📝 Creating booking for consultant:', consultant_id);
      consultant = await Consultant.findById(consultant_id);

      if (!consultant) {
        console.log('⚠️ Provided consultant not found. Falling back to default consultant.');
        consultant = await ensureDefaultConsultant();
        consultant_id = consultant._id;
      }
    }

    console.log('✅ Found consultant:', consultant.name);

    const newBooking = new Booking({
      patient_id: patient._id,
      consultant_id,
      appointment_date,
      symptoms,
      patient_name,
      patient_email,
      patient_phone
    });

    const booking = await newBooking.save();
    console.log('✅ Booking created successfully');

    // Prepare email data
    const emailData = {
      patient: {
        full_name: patient_name || patient.full_name,
        email: patient_email || patient.email_address || patient.email,
        phone: patient_phone || patient.contact_number || patient.phone
      },
      consultant: {
        name: consultant.name,
        email: consultant.email
      },
      admin: {
        name: process.env.DEFAULT_CONSULTANT_NAME || 'Admin'
      },
      preferredDate: appointment_date,
      symptoms: symptoms || 'Not specified',
      bookingToken: booking._id.toString().substring(0, 8).toUpperCase()
    };

    // Send emails to both patient and doctor (async, don't wait)
    sendBookingEmails(emailData).catch(err => {
      console.error('Email sending failed:', err);
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
};
