const mysql = require('mysql')
const dotenv = require('dotenv')

// Linking file that contains sensitive information

dotenv.config({ path : './.env' })

// Values for the connection to the database

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

module.exports = db