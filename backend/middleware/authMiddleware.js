const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.error("❌ Kein Token im Header gefunden.");
    return res.status(403).send("Token wird benötigt.");
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.error("❌ Token fehlt.");
    return res.status(403).send("Token wird benötigt.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Ungültiger Token.");
    return res.status(401).send("Ungültiger Token.");
  }

};
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Keine Admin-Rechte.");
  }
};
