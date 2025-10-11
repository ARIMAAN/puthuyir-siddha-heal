const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  medicines: String,
  notes: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
