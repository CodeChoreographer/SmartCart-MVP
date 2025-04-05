const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true
});

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'inventory',
  timestamps: true
});

User.hasMany(Inventory, { foreignKey: 'userId', onDelete: 'CASCADE' });
Inventory.belongsTo(User, { foreignKey: 'userId' });

const initDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Tabellen werden erstellt oder angepasst, ohne Daten zu verlieren
    console.log('✅ Verbindung zur Datenbank erfolgreich hergestellt und Tabellen synchronisiert.');
    return sequelize;
  } catch (error) {
    console.error('❌ Verbindung fehlgeschlagen:', error);
  }
};

module.exports = { initDb, User, Inventory };
