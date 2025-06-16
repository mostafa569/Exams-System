const jwt = require('jsonwebtoken');

const isAuthStudent = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    if (decoded.role !== 'student') {
      return res.status(403).json({ message: 'Access denied: Student role required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = { isAuthStudent };