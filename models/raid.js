const {DataTypes} = require('sequelize');
const db = require("../db");

const Raid = db.define("raid", {
    expansion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nameOfFight: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bossName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    videoLink: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = Raid;