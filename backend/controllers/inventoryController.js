const { getConnection } = require('../models/db');

exports.getInventory = async (req, res) => {
  try {
    const connection = getConnection();
    const userId = req.user.userId;

    const [results] = await connection.query(
      "SELECT * FROM inventory WHERE userId = ?", [userId]
    );
    res.json(results);
  } catch (err) {
    console.error("❌ Fehler bei der Datenbankabfrage:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.addItem = async (req, res) => {
  const { name, quantity, unit } = req.body;
  const userId = req.user.userId; // 🟢 User-ID aus Token

  try {
    const connection = getConnection();
    const [results] = await connection.query(
      "INSERT INTO inventory (name, quantity, unit, userId) VALUES (?, ?, ?, ?)",
      [name, quantity, unit, userId]
    );
    res.json({ message: "Artikel hinzugefügt", id: results.insertId });
  } catch (err) {
    console.error("❌ Fehler beim Hinzufügen:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const connection = getConnection();
    const [results] = await connection.query(
      "DELETE FROM inventory WHERE id = ? AND userId = ?",
      [id, userId]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: `Artikel mit ID ${id} nicht gefunden.` });
    }

    res.json({ message: "Artikel gelöscht" });
  } catch (err) {
    console.error("❌ Fehler beim Löschen:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, unit } = req.body;
  const userId = req.user.userId;

  try {
    const connection = getConnection();
    const [results] = await connection.query(
      "UPDATE inventory SET name = ?, quantity = ?, unit = ? WHERE id = ? AND userId = ?",
      [name, quantity, unit, id, userId]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: `Artikel mit ID ${id} nicht gefunden.` });
    }

    res.json({ message: "Artikel erfolgreich aktualisiert" });
  } catch (err) {
    console.error("❌ Fehler beim Aktualisieren:", err.message);
    res.status(500).json({ error: err.message });
  }
};
