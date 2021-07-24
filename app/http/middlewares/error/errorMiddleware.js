// External dependencies
const createHttpError = require("http-errors")

function notFoundMiddleware(req, res, next) {
    next(createHttpError(404, 'Your requested content was not found !'))
}

function defaultErrorMiddleware(err, req, res, next) {
    res.locals.error = (process.env.NODE_ENV === 'development') ? {message: err.message} : err

    res.status(err.status || 500)

    if(!res.locals.html){
        res.render('errors/error', {
            title: "Error page"
        })
    }else{
        res.json(res.locals.error)
    }
}

module.exports = {
    notFoundMiddleware,
    defaultErrorMiddleware
}