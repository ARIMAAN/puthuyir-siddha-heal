const Patient = require('../models/Patient');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user_id: req.userId });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password_hash');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Also fetch the patient profile to get the most up-to-date phone number
    const patient = await Patient.findOne({ user_id: req.userId });

    // Combine data, giving preference to patient data if available
    const userData = {
      full_name: (patient && patient.name) || user.full_name || '',
      email: user.email || '',
      phone: (patient && patient.contact_number) || user.phone || ''
    };

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

exports.getUnifiedUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password_hash');
    const patient = await Patient.findOne({ user_id: req.userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a unified user object for the frontend
    const unifiedUser = {
      ...user.toObject(),
      full_name: patient?.full_name || user.full_name,
      email: user.email,
      phone: patient?.contact_number || user.phone || ''
    };

    res.json(unifiedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unified user data" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let patient = await Patient.findOne({ user_id: req.userId });
    if (!patient) {
      patient = new Patient({ user_id: req.userId });
    }

    Object.assign(patient, req.body);
    patient.profile_completed = true; // Mark patient profile as complete
    await patient.save();

    // Also update the profile_completed flag in the User model
    const user = await User.findById(req.userId);
    if (user) {
      user.profile_completed = true;
      await user.save();
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};
