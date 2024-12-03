const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secret_key';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido o expirado.' });
    req.user = user;
    next();
  });
}

function generateToken(user) {
  return jwt.sign(user, SECRET_KEY, { expiresIn: '1m' });
}

module.exports = { authenticateToken, generateToken };
