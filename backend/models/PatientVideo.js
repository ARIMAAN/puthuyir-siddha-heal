const mongoose = require("mongoose");

const patientVideoSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  file_url: String,
  upload_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PatientVideo", patientVideoSchema);
