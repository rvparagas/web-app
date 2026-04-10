const jwt = require('jsonwebtoken');
const AuthUser = require('../models/authUser.model');
const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await AuthUser.findById(decoded.userId).select('email');
    req.user = { userId: decoded.userId, email: user?.email };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
