const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader && authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : null;

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = authenticateToken;