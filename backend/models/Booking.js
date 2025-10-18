const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  consultant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant", required: true },
  appointment_date: Date,
  appointment_time: String,
  consultation_type: { type: String, enum: ["chat", "audio", "video"], default: "chat" },
  symptoms: String,
  patient_name: String,
  patient_email: String,
  patient_phone: String,
  status: { type: String, enum: ["booked", "confirmed", "completed", "cancelled"], default: "booked" },
  prescription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }
}, {
  timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);
