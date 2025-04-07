const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const { Client } = require('pg');

let client;

const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Versuch, Verbindung zur PostgreSQL-Datenbank herzustellen... (Versuch ${i + 1} von ${retries})`);

      client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });

      await client.connect();
      console.log("✅ Verbindung zur PostgreSQL-Datenbank hergestellt!");
      return client;
    } catch (error) {
      console.error(`❌ Fehler bei der Verbindung: ${error.message}`);
      if (i < retries - 1) {
        console.log(`⏳ Warte ${delay / 1000} Sekunden bevor erneut versucht wird...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("❌ Verbindung zur Datenbank fehlgeschlagen, alle Versuche ausgeschöpft.");
        process.exit(1);
      }
    }
  }
};

const initDb = async () => {
  try {
    const client = await connectWithRetry();

    const fs = require('fs');
    const path = require('path');
    const sqlFilePath = path.join(__dirname, 'smartcart.sql');
    if (fs.existsSync(sqlFilePath)) {
      const sql = fs.readFileSync(sqlFilePath, 'utf-8');
      const queries = sql.split(';').filter(q => q.trim());

      for (const query of queries) {
        await client.query(query.trim() + ';');
      }

      console.log("✅ Tabellen erfolgreich erstellt/importiert!");
    } else {
      console.log("⚠️ Keine SQL-Datei gefunden, es wurden keine Tabellen importiert.");
    }

    return client;
  } catch (error) {
    console.error("❌ Fehler bei der Initialisierung der DB:", error.message);
    process.exit(1);
  }
};

module.exports = {
  initDb,
  getConnection: () => client
};
