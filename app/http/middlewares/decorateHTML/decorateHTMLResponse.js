// External dependencies
const jwt = require('jsonwebtoken')

function decorateHTMLResponse(pageTitle) {
    
    return (req, res, next) => {
        let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null

        if(cookies){
            const token = cookies[process.env.COOKIE_NAME]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const {name, phone, email, role} = decoded
            res.locals.loggedInUser =  (name && phone && role) ? {name, phone, email, role} : {}
        }else{
            res.locals.loggedInUser = {}
        }
        res.locals.html = true
        res.locals.title = `${pageTitle} - ${process.env.APP_NAME}`
        res.locals.errors = {}
        res.locals.data = {}
        next()
    }
}

module.exports = decorateHTMLResponse