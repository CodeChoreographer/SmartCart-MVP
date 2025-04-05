const { Inventory } = require('../models/db');

exports.getInventory = async (req, res) => {
  try {
    const userId = req.user.userId; // Benutzer-ID aus dem Token
    console.log(`📥 Benutzer-ID: ${userId}`);

    const inventory = await Inventory.findAll({ where: { userId } });
    res.json(inventory);
  } catch (err) {
    console.error('❌ Fehler beim Abrufen des Inventars:', err.message);
    res.status(500).json({ error: 'Fehler beim Abrufen des Inventars' });
  }
};


exports.addItem = async (req, res) => {
  const { name, quantity, unit } = req.body;
  const userId = req.user.userId;

  try {
    const newItem = await Inventory.create({ name, quantity, unit, userId });
    res.json(newItem);
  } catch (err) {
    console.error('❌ Fehler beim Hinzufügen eines Items:', err.message);
    res.status(500).json({ error: 'Fehler beim Hinzufügen eines Items' });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const deleted = await Inventory.destroy({ where: { id, userId } });
    if (deleted) res.json({ message: 'Item erfolgreich gelöscht' });
    else res.status(404).json({ error: 'Item nicht gefunden oder keine Berechtigung' });
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
    const updated = await Inventory.update(
      { name, quantity, unit },
      { where: { id, userId } }
    );
    res.json(updated);
  } catch (err) {
    console.error('❌ Fehler beim Aktualisieren eines Items:', err.message);
    res.status(500).json({ error: 'Fehler beim Aktualisieren eines Items' });
  }
};
