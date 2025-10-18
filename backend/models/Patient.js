const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  full_name: { type: String, required: true },
  date_of_birth: Date,
  age: Number,
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other", "Prefer not to say"], 
    required: true 
  },
  blood_group: { 
    type: String, 
    enum: ["O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "Unknown"] 
  },
  
  // Contact Information
  contact_number: { type: String, required: true },
  email_address: { type: String, required: true },
  
  // Address Information
  street_address: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  
  // Emergency Contact Information
  emergency_contact_name: String,
  emergency_contact_relationship: String,
  emergency_contact_phone: String,
  
  // Medical Information
  health_background: String,
  
  // Profile Status
  profile_completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Calculate age from date of birth
patientSchema.pre('save', function(next) {
  if (this.date_of_birth && !this.age) {
    const today = new Date();
    const birthDate = new Date(this.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    this.age = age;
  }
  next();
});

module.exports = mongoose.model("Patient", patientSchema);
