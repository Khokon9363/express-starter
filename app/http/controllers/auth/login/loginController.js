// External dependencies
const createHttpError = require('http-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Internal dependencies
const People = require('../../../../models/People')

function index(req, res, next) {
    res.render('auth/login')
}

async function login(req, res, next) {
    try {
        const people = await People.findOne({
            $or: [
                {
                    email: req.body.phone_email
                },
                {
                    phone: req.body.phone_email
                }
            ]
        })
        if(people && people._id){
            const validPassword = await bcrypt.compare(req.body.password, people.password)
            if(validPassword){
                const peopleObj = {
                    name: people.name,
                    email: people.email,
                    phone: people.phone,
                    role: people.role
                }
                // generate token
                const token = jwt.sign(peopleObj, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY_TIME
                })
                // set cookie in browser
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY_TIME,
                    httpOnly: true,
                    signed: true
                })
                if(res.locals.html){
                    // set user as loggedInUser in locals
                    res.locals.loggedInUser = peopleObj
                    res.locals.title = `Home - ${process.env.APP_NAME}`
                    res.locals.data = {
                        success: {
                            message: 'Logged in successfully !'
                        }
                    }
                    res.render('home')
                }else{
                    res.status(200).json({
                        data: {
                            user: peopleObj
                        }
                    })
                }
            }else{
                throw createHttpError('Login failed ! Password does not match !')
            }
        }else{
            throw createHttpError('Login failed ! Email or phone does not matching with our records')
        }
    } catch (err) {
        if(res.locals.html){
            res.locals.data = {
                phone_email: req.body.phone_email
            }
            res.locals.errors = {
                common: {
                    msg: err.message
                }
            }
            res.render('auth/login')
        }else{
            res.status(200).json({
                errors: {
                    common: {
                        msg: err.message
                    }
                }
            })
        }
    }
}

function logout(req, res, next) {
    res.clearCookie(process.env.COOKIE_NAME)
    res.status(200).json({
        data: {
            success: {
                message: 'Logged out successfully'
            }
        }
    })
}

module.exports = {
    index,
    login,
    logout
}