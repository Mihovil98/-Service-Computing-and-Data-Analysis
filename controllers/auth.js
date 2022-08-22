const db = require('../database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { promisify } = require('util')
const axios = require('axios')

exports.register = (req, res) => {

    const { name, email, password, passwordConfirm } = req.body

    if(!name || !email || !password || !passwordConfirm) {
        return res.status(400).render('register', {
            message: 'Please fill out all of the input fields'
        })
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error)
        }

        if(results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if(password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8)

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
            if(error) {
                console.log(error)
            } else {
                return res.render('register', {
                    successMessage: 'User registered'
                })
            }
        })
    })
}

exports.login = (req, res) => {
    try{
        const { email, password } = req.body

        if(!email || !password) {
            return res.status(400).render('index', {
                message: 'Please provide email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                return res.status(401).render('index', {
                    message: 'Email or password is incorrect'
                })
            } else {
                const id = results[0].id

                const token = jwt.sign( { id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions)
                res.status(200).redirect('/main')
            }
        })

    }catch(error){
        console.log(error)
    }
}

exports.isLoggedIn = async (req, res, next) => {
    
    if(req.cookies.jwt){
        try {
            // Verify the token

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

            // Check if the user still exists

            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, results) => {

                if(!results){
                    return next()
                }

                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        next()
    }
}

exports.predict = async (req, res) => {
    const { pctKidsBornNevrMarrInput, pctKids2ParInput, pctWhiteInput, pctBlackInput, pctWdivInput, pctPubAsstInput, pctAllDivorcInput, pctPovertyInput, pctVacantBoardedInput, pctUnemployInput, territory } = req.body

    const button = req.body.button

    if(button == 'predict'){
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

        db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, results) => {
            const user = results[0]

            if(!pctKidsBornNevrMarrInput || !pctKids2ParInput || !pctWhiteInput || !pctBlackInput || !pctWdivInput || !pctPubAsstInput || !pctAllDivorcInput || !pctPovertyInput || !pctVacantBoardedInput || !pctUnemployInput || !territory) {
                return res.status(400).render('main', {
                    user: user,
                    error: 'Please fill out all of the input fields'
                })
            }

            if(pctKidsBornNevrMarrInput < 0 || pctKidsBornNevrMarrInput > 100 ||
                pctKids2ParInput < 0 || pctKids2ParInput > 100 ||
                pctWhiteInput < 0 || pctWhiteInput > 100 ||
                pctBlackInput < 0 || pctBlackInput > 100 ||
                pctWdivInput < 0 || pctWdivInput > 100 ||
                pctPubAsstInput < 0 || pctPubAsstInput > 100 ||
                pctAllDivorcInput < 0 || pctAllDivorcInput > 100 ||
                pctPovertyInput < 0 || pctPovertyInput > 100 ||
                pctVacantBoardedInput < 0 || pctVacantBoardedInput > 100 ||
                pctUnemployInput < 0 || pctUnemployInput > 100) {
                return res.status(400).render('main', {
                    user: user,
                    error: 'Input must be in range 0 - 100'
                })
            }

            db.query('SELECT territory FROM predictions WHERE userID = ?', [user.id], (error, results) => {
                for(let i = 0; i < results.length; i++){
                    if(results[i].territory == territory) {
                        return res.status(400).render('main', {
                            user: user,
                            error: 'Territory already exists'
                        })
                    }
                }
            })
    
            var data = JSON.stringify({
                "Inputs": {
                    "input1": {
                        "ColumnNames": [
                            "pctBlack",
                            "pctWhite",
                            "pctWdiv",
                            "pctPubAsst",
                            "pctPoverty",
                            "pctUnemploy",
                            "pctAllDivorc",
                            "pctKids2Par",
                            "pctKidsBornNevrMarr",
                            "pctVacantBoarded"
                        ],
                        "Values": [
                            [
                                pctBlackInput,
                                pctWhiteInput,
                                pctWdivInput,
                                pctPubAsstInput,
                                pctPovertyInput,
                                pctUnemployInput,
                                pctAllDivorcInput,
                                pctKids2ParInput,
                                pctKidsBornNevrMarrInput,
                                pctVacantBoardedInput
                            ]
                        ]
                    }
                },
                "GlobalParameters": {}
            })
        
            var config = {
                method: 'post',
                url: 'https://ussouthcentral.services.azureml.net/workspaces/5b297f9d79ea4d5bbccbb36e0920b075/services/fb0c9810e0214b018f2c92b019ca9d79/execute?api-version=2.0&details=true',
                headers: {
                    'Authorization': 'Bearer d+90IuTfDWvwT0wLXEsDYtVXedjCybXm4lTAz+bLGLEW4q/kgunYK1K7EkpVWE2h1fDQ0fygsHdF+AMC0OBDRg==',
                    'Content-Type': 'application/json'
                },
                data: data
            }
        
            axios(config)
                .then(function (response) {
                    const raw = JSON.stringify(response.data)
                    const resultJSON = JSON.parse(raw)
                    let result = Math.round(resultJSON.Results.output1.value.Values[0][0])
                    if (result <= 0) {
                        result = 1
                    }
                    return res.status(200).render('main', {
                        user: user,
                        pctBlackInput: pctBlackInput,
                        pctWhiteInput: pctWhiteInput,
                        pctWdivInput: pctWdivInput,
                        pctPubAsstInput: pctPubAsstInput,
                        pctPovertyInput: pctPovertyInput,
                        pctUnemployInput: pctUnemployInput,
                        pctAllDivorcInput: pctAllDivorcInput,
                        pctKids2ParInput: pctKids2ParInput,
                        pctKidsBornNevrMarrInput: pctKidsBornNevrMarrInput,
                        pctVacantBoardedInput: pctVacantBoardedInput,
                        territory: territory,
                        result: result
                    })
                })
                .catch(function (error) {
                    console.log(error)
                    return res.status(504).render('main', {
                        user: user,
                        error: 'Azure ESOCKETTIMEDOUT, try again'
                    })
                });
        })
    }
    else if(button == 'save'){
        const result = req.body.result

        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

        db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, results) => {
            const user = results[0]
        
        db.query('INSERT INTO predictions SET ?', {pctKidsBornNevrMarr: pctKidsBornNevrMarrInput, pctKids2Par: pctKids2ParInput, pctWhite: pctWhiteInput, pctBlack: pctBlackInput, pctWdiv: pctWdivInput, pctPubAsst: pctPubAsstInput, pctAllDivorc: pctAllDivorcInput, pctPoverty: pctPovertyInput, pctVacantBoarded: pctVacantBoardedInput, pctUnemploy: pctUnemployInput, violentPerPop: result, territory: territory, userid: user.id}, (error, results) => {
            if(error) {
                console.log(error)
            } else {
                setTimeout(function () {
                    return res.redirect('/main')
                }, 3000);
            }
        })
    })
    }
}

exports.update = async (req, res, next) => {
    if(req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            db.query("SELECT id, pctKidsBornNevrMarr, pctKids2Par, pctWhite, pctBlack, pctWdiv, pctPubAsst, pctAllDivorc, pctPoverty, pctVacantBoarded, pctUnemploy, violentPerPop, territory  FROM predictions WHERE userid = ?", [decoded.id], (error, results) => {
                res.json(results)
            });
        } catch (error) {
            return res.redirect('/')
        }
    } else {
        return res.redirect('/')
    }
}

exports.remove = async (req, res) => {
    const itemID = req.body.remove
    db.query("DELETE FROM predictions WHERE id = ?", [itemID], (error, results) => {
        res.status(200).redirect('/saved')
    })
}

exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    })

    res.status(200).redirect('/')
}