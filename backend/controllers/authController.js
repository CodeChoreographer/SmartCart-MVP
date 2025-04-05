require('dotenv').config();
const { User } = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '5h';

exports.register = async (req, res) => {
  const { firstName, lastName, email, gender, password, isAdmin = false } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      gender,
      password: hashedPassword,
      isAdmin
    });

    res.json({ message: "Benutzer erfolgreich registriert", userId: newUser.id });
  } catch (err) {
    console.error("❌ Fehler bei der Registrierung:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Ungültige Anmeldedaten" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Ungültige Anmeldedaten" });
    }

    const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );

    res.json({ message: "Erfolgreich angemeldet", token });
  } catch (err) {
    console.error("❌ Fehler bei der Anmeldung:", err.message);
    res.status(500).json({ error: err.message });
  }
};

