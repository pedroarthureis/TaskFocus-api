const { DataTypes } = require('sequelize');
const sequelize = require('../dbSequelize');

const Perfil = sequelize.define('Perfil', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  perfil_nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'perfis',
  timestamps: true,
});

module.exports = Perfil;
