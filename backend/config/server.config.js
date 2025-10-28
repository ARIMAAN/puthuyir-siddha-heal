const MongoStore = require('connect-mongo');

// Allowed origins are read from a comma-separated string in the .env file
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

// In development, always allow localhost
const isDevelopment = process.env.NODE_ENV !== 'production';
const developmentOrigins = ['http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:5173'];

exports.corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // In development, allow localhost origins
    if (isDevelopment && developmentOrigins.some(devOrigin => origin.startsWith(devOrigin))) {
      return callback(null, true);
    }
    
    // Check against allowed origins from env
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

exports.sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    maxAge: 3 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
};
