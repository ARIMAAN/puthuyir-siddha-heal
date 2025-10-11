const mongoose = require("mongoose");

const consultantSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  about: String,
  available_slots: [Date]
});

module.exports = mongoose.model("Consultant", consultantSchema);
