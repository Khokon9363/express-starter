// External dependencies
const bcrypt = require('bcrypt')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

// Internal dependencies
const People = require('../../models/People')

// view
function getLogin(req, res, next) {
    res.render('login', {
        title: 'Login page -  Chat Application'
    })
}

// login
async function login(req, res, next) {
    try {
        const people = await People.findOne({
            $or: [
                {
                    email: req.body.username
                },
                {
                    mobile: req.body.username
                }
            ]
        })
        if(people && people._id){
            const isValidPassword = await bcrypt.compare(req.body.password, people.password)
            if(isValidPassword){
                const peopleObj = {
                    name: people.name,
                    mobile: people.mobile,
                    email: people.email,
                    role: people.role
                }

                // generate token
                const token = jwt.sign(peopleObj, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                })

                // set cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true
                })

                // set loggedInUser in local
                res.locals.loggedInUser = peopleObj

                res.render('inbox')
            }else{
                throw createError("Login failed! Please try again!")
            }
        }else{
            throw createError("Login failed! Please try again!")
        }
    } catch (err) {
        res.render('login', {
            data: {
                username: req.body.username
            },
            errors: {
                common: {
                    msg: err.message
                }
            }
        })
    }
}

// logout
function logout(req, res){
    res.clearCookie(process.env.COOKIE_NAME)
    res.send("Logged out successfully")
}

module.exports = {
    getLogin,
    login,
    logout
}