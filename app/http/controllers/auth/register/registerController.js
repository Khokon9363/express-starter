// External dependencies
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Internal dependencies
const People = require('../../../../models/People')

function index(req, res, next) {
    res.render('auth/register')
}

async function register(req, res, next) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    let people = new People({
        ...req.body, // all fields
        password: hashedPassword
    })

    if(req.files && req.files.length > 0){
        people.avatar = req.files[0].path
    }

    // Save people or send error
    try {
        const result = await people.save()
        if(result){
                // Login functionalities
                const peopleObj = {
                    name: people.name,
                    phone: people.phone,
                    email: people.email,
                    role: people.role
                }
                // generate token
                const token = jwt.sign(peopleObj, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY_TIME
                })
                // set cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY_TIME,
                    httpOnly: true,
                    signed: true
                })
            if(res.locals.html){
                // set user as loggedIn on locals
                res.locals.loggedInUser = peopleObj
                res.locals.data = {
                    success: {
                        message: 'People registered successfully !'
                    }
                }
                res.locals.title = `Home - ${process.env.APP_NAME}`
                res.render('home')
            }else{
                // pass user as loggedIn on api
                res.status(200).json({
                    loggedInUser: peopleObj,
                    message: "People registered successfully !"
                })
            }
        }else{
            res.status(500).json({
                errors: {
                    common: 'People registration failed !'
                }
            })
        }
    } catch (err) {
        res.status(500).json({
            errors: {
                common: err.message
            }
        })
    }
}

module.exports = {
    index,
    register
}