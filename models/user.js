const {DataTypes} = require('sequelize');
const db = require('../db');

const User = db.define('user', {
    characterName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM,
        defaultValue: "user",
        values: ["user", "admin"],
        allowNull: true
    }
});

module.exports = User;