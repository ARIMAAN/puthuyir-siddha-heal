const mongoose = require("mongoose");

const consultantSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  about: String,
  email: { type: String, required: false }, // Doctor's email for booking notifications
  phone: { type: String, required: false }, // Doctor's phone number
  available_slots: [Date]
});

module.exports = mongoose.model("Consultant", consultantSchema);
