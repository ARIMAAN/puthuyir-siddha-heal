const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password_hash: String, // optional if using OAuth only
  is_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  role: { type: String, enum: ["client", "consultant", "admin"], default: "client" }
});

module.exports = mongoose.model("User", userSchema);
