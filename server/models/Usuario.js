const { DataTypes } = require('sequelize');
const sequelize = require('../dbSequelize');
const Perfil = require('./Perfil');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_perfil: {
    type: DataTypes.INTEGER,
    references: {
      model: Perfil,
      key: 'id'
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
});

// Relacionamento 1:1
Usuario.belongsTo(Perfil, { foreignKey: 'id_perfil', as: 'perfil' });
Perfil.hasOne(Usuario, { foreignKey: 'id_perfil' });

module.exports = Usuario;
