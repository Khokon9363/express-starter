// external dependencies
const createError = require('http-errors')

// Not found error handling middleware
function notFoundMiddleware(req, res, next) {
    next(createError(404, "Your requested content was not found"))
}

// default error handling middleware
function errorMiddleware(err, req, res, next) {
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {message: err.message}
    
    res.status(err.status || 500)
    
    if(!res.locals.html){
        res.render('error', {
            title: "Error page"
        })
    }else{
        res.json(res.locals.error)
    }
}

module.exports = {
    notFoundMiddleware,
    errorMiddleware
}