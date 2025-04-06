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
    const createdAt = new Date();
    const updatedAt = new Date();
    const connection = await getConnection();

    const result = await connection.query(
      `INSERT INTO users ("firstName", "lastName", email, gender, password, "isAdmin", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [firstName, lastName, email, gender, hashedPassword, isAdmin, createdAt, updatedAt]
    );

    res.json({ message: "Benutzer erfolgreich registriert", userId: result.rows[0].id });
  } catch (err) {
    console.error("❌ Fehler bei der Registrierung:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await getConnection();
    const result = await connection.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Ungültige Anmeldedaten" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Ungültige Anmeldedaten" });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin }, // Wenn du camelCase verwendest, bleib dabei
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({ message: "Erfolgreich angemeldet", token });
  } catch (err) {
    console.error("❌ Fehler bei der Anmeldung:", err.message);
    res.status(500).json({ error: err.message });
  }
};
