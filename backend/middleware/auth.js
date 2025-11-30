const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_assignment_only';

module.exports = function auth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: false,
      message: 'Authorization header missing or invalid'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { userId, username, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or expired token'
    });
  }
};
