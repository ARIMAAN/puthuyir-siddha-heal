require('dotenv').config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
// Import configurations
const { corsOptions, sessionConfig } = require('./config/server.config');
const connectDB = require('./config/db.config');
const passportConfig = require('./config/passport.config');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(session(sessionConfig));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Import routes
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const userRoutes = require('./routes/user.routes');
const bookingRoutes = require('./routes/booking.routes');
const consultantRoutes = require('./routes/consultant.routes');
// const contactRoutes = require('./routes/contact.routes');

// Import middleware
const errorHandler = require('./middleware/error.middleware');

// Health check endpoints (support both direct and prefixed calls)
const healthHandler = (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
};

app.get('/health', healthHandler);

app.get('/api/health', healthHandler);

// Handle OPTIONS requests for CORS preflight
app.options('*', (req, res) => {
  res.status(200).end();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/consultants', consultantRoutes);
// app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use(errorHandler);


module.exports = app;

// Start server only if this file is run directly (for local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
