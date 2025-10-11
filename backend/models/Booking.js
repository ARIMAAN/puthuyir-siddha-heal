const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  consultant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant", required: true },
  appointment_date: Date,
  status: { type: String, enum: ["booked", "completed", "cancelled"], default: "booked" },
  prescription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }
});

module.exports = mongoose.model("Booking", bookingSchema);
