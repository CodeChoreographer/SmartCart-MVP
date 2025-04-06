const { getConnection } = require('../models/db');

exports.getAllUsers = async (req, res) => {
  try {
    const connection = getConnection();
    const result = await connection.query("SELECT id, firstName, lastName, email, isAdmin FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Benutzer:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const connection = getConnection();
    const { id } = req.params;
    await connection.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "Benutzer erfolgreich gelöscht" });
  } catch (error) {
    console.error("❌ Fehler beim Löschen des Benutzers:", error.message);
    res.status(500).json({ error: error.message });
  }
};
