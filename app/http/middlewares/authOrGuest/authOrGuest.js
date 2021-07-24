// External dependencies
const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null

    if(cookies){
        try {
            const token = cookies[process.env.COOKIE_NAME]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded

            // pass user informations to locals
            if(res.locals.html){
                res.locals.loggedInUser = decoded
            }
            next()
        } catch (err) {
            if(res.locals.html){
                res.redirect('/login')
            }else{
                res.status(500).json({
                    errors: {
                        common: {
                            msg: 'Server error !'
                        }
                    }
                })
            }
        }
    }else{
        if(res.locals.html){
            res.redirect('/login')
        }else{
            res.status(401).json({
                errors: {
                    common: {
                        msg: 'Not authenticated !'
                    }
                }
            })
        }
    }
}

function guest(req, res, next) {
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null

    if(!cookies){
        next()
    }else{
        res.redirect('/')
    }
}

module.exports = {
    auth,
    guest
}