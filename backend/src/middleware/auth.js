import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = header.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    const payload = jwt.verify(token, secret);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default auth;

