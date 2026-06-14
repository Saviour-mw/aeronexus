// ─────────────────────────────────────────────
//  AERONEXUS — Auth Middleware
// ─────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'change_me';

/**
 * Verify a JWT from the Authorization: Bearer <token> header.
 * Attaches decoded payload to req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Requires the token to have role === 'admin'.
 */
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}

/**
 * Sign a JWT for a user or admin.
 */
function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

module.exports = { requireAuth, requireAdmin, signToken };
