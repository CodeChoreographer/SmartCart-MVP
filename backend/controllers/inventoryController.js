const { Inventory } = require('../models/db');

exports.getInventory = async (req, res) => {
  try {
    const connection = getConnection();
    const result = await connection.query("SELECT * FROM inventory");
    res.json(result.rows); // ✅ Nur rows zurückgeben
  } catch (err) {
    console.error('❌ Fehler beim Abrufen des Inventars:', err.message);
    res.status(500).json({ error: 'Fehler beim Abrufen des Inventars' });
  }
};


exports.addItem = async (req, res) => {
  const { name, quantity, unit } = req.body;
  const userId = req.user.userId;

  try {
    const connection = getConnection();
    const result = await connection.query(
      "INSERT INTO inventory (name, quantity, unit) VALUES ($1, $2, $3) RETURNING id",
      [name, quantity, unit]
    );
    res.json({ message: "Artikel hinzugefügt", id: result.rows[0].id });
  } catch (err) {
    console.error('❌ Fehler beim Hinzufügen eines Items:', err.message);
    res.status(500).json({ error: 'Fehler beim Hinzufügen eines Items' });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = getConnection();
    const result = await connection.query("DELETE FROM inventory WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `Artikel mit ID ${id} nicht gefunden.` });
    }

    res.json({ message: "Artikel gelöscht" });
  } catch (err) {
    console.error('❌ Fehler beim Löschen eines Items:', err.message);
    res.status(500).json({ error: 'Fehler beim Löschen eines Items' });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, unit } = req.body;
  const userId = req.user.userId;

  try {
    const connection = getConnection();
    const result = await connection.query(
      "UPDATE inventory SET name = $1, quantity = $2, unit = $3 WHERE id = $4",
      [name, quantity, unit, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `Artikel mit ID ${id} nicht gefunden.` });
    }

    res.json({ message: "Artikel erfolgreich aktualisiert" });
  } catch (err) {
    console.error('❌ Fehler beim Aktualisieren eines Items:', err.message);
    res.status(500).json({ error: 'Fehler beim Aktualisieren eines Items' });
  }
};
