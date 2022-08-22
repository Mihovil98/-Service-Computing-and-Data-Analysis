const express = require('express')
const authController = require('../controllers/auth')

const router = express.Router()

router.get('/', authController.isLoggedIn, (req, res) => {
    if(req.user){
        res.redirect('/main')
    } else {
        res.render('index')
    }
})

router.get('/register', authController.isLoggedIn, (req, res) => {
    if(req.user){
        res.redirect('/main')
    } else {
        res.render('register')
    }
})

router.get('/main', authController.isLoggedIn, (req, res) => {
    if(req.user){
        res.render('main', {
            user: req.user
        })
    } else {
        res.redirect('/')
    }

})

router.get('/saved', authController.isLoggedIn, (req, res) => {
    if(req.user){
        res.render('saved')
    } else {
        res.redirect('/')
    }
})

module.exports = router