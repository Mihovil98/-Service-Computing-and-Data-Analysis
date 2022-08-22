const express = require('express')
const authController = require('../controllers/auth')
const router = express.Router()

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/predict', authController.predict)

router.get('/items', authController.isLoggedIn, authController.update)

router.post('/remove', authController.remove)

router.get('/logout', authController.logout)

module.exports = router