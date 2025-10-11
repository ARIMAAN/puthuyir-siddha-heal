const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();

// Models
const User = require("./models/User");
const Patient = require("./models/Patient");
const Consultant = require("./models/Consultant");
const Booking = require("./models/Booking");

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./utils/passportGoogle")(passport);

// Google OAuth routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, name: req.user.name, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`http://localhost:5173/consultant?token=${token}&name=${encodeURIComponent(req.user.name)}`);
  }
);

// Email/password login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name: email.split("@")[0], is_verified: true });
  }
  const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, name: user.name });
});

// Profile routes
app.get("/api/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const patient = await Patient.findOne({ user_id: userId });
    res.json(patient);
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/api/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    let patient = await Patient.findOne({ user_id: userId });
    if (!patient) patient = new Patient({ user_id: userId });
    Object.assign(patient, req.body);
    await patient.save();
    res.json({ success: true });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Book appointment
app.post("/api/book", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) return res.status(400).json({ error: "Profile incomplete" });

    const consultant = await Consultant.findOne({ name: req.body.consultant });
    if (!consultant) return res.status(404).json({ error: "Consultant not found" });

    const booking = new Booking({
      patient_id: patient._id,
      consultant_id: consultant._id,
      appointment_date: req.body.date,
    });
    await booking.save();
    res.json({ success: true, booking });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
