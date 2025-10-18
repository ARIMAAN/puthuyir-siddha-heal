const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  consultant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant", required: true },
  appointment_date: Date,
  symptoms: String,
  patient_name: String,
  patient_email: String,
  patient_phone: String,
  status: { type: String, enum: ["booked", "confirmed", "completed", "cancelled"], default: "booked" },
  prescription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  token: { type: String, unique: true, sparse: true },
  token_expires_at: Date,
  is_token_booking: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);
