const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

exports.checkProfileComplete = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.profile_completed) {
      return res.status(403).json({ error: "Please complete your profile first" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
