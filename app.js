const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()

const cors = require('cors')
app.use(cors())

// Values for the connection to the database

const db = require('./database')

// Connection to the database

db.connect((error) => {
    if(error){
        console.log(error)
    } else {
        console.log('MySQL connected...')
    }
})

// Setup for simpler linking of public directory files

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

// Parse URL-encoded bodies (as sent by HTML forms)

app.use(express.urlencoded({ extended: false }))

// Parse JSON bodies (as sent by API clients)

app.use(express.json())

// Initializing cookieParser() for setting up cookies in the browser

app.use(cookieParser())

// Render engine setup

app.set('view engine', 'hbs')

// Define routes

app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

// Server setup

app.listen(5000, () => {
    console.log('Server running...')
})