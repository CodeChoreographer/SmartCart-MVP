const express = require('express');
const cors = require('cors');
const { initDb, sequelize } = require('./models/db');
const inventoryRoutes = require('./routes/inventoryRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/recipes', recipeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


let connection;

initDb().then(conn => {
  connection = conn;
  app.listen(port, () => {
    console.log(`✅ Server läuft auf Port ${port}`);
    console.log(`✅ Backend ist erreichbar unter: http://localhost:${port}`);
    console.log(`✅ Applikation ist erreichbar unter: http://localhost:4200`);
  });
}).catch(err => {
  console.error("❌ Fehler beim Initialisieren der Datenbank:", err);
});


