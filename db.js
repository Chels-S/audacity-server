require ('dotenv').config();
const {Sequelize} = require ('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    ssl: process.env.ENVIRONMENT === 'production'
})

// const db = new Sequelize(process.env.DB_CONNECTION_STRING);

module.exports = sequelize;