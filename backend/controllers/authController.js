require('dotenv').config();
const { getConnection } = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '5h';

exports.register = async (req, res) => {
  const { firstName, lastName, email, gender, password, isAdmin = false } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = getConnection();

    const [results] = await connection.query(
      "INSERT INTO users (firstName, lastName, email, gender, password, isAdmin) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, gender, hashedPassword, isAdmin]
    );

    res.json({ message: "Benutzer erfolgreich registriert", userId: results.insertId });
  } catch (err) {
    console.error("❌ Fehler bei der Registrierung:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = getConnection();
    const [users] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) return res.status(400).json({ error: "Ungültige Anmeldedaten" });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).json({ error: "Ungültige Anmeldedaten" });

    const isAdmin = user.isAdmin === 1;

    const token = jwt.sign(
      { userId: user.id, isAdmin: isAdmin },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({ message: "Erfolgreich angemeldet", token });
  } catch (err) {
    console.error("❌ Fehler bei der Anmeldung:", err.message);
    res.status(500).json({ error: err.message });
  }
};

