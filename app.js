// External dependencies
const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser')

// Internal dependencies
const { notFoundMiddleware, defaultErrorMiddleware } = require('./app/http/middlewares/error/errorMiddleware')
const homeRouter = require('./routes/homeRouter')
const loginRouter = require('./routes/loginRouter')
const registerRouter = require('./routes/registerRouter')
const dashboardRouter = require('./routes/dashboardRouter')

// app initialization
const app = express()
dotenv.config()

// database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log('Database connected')
}).catch((err) => {
    console.log('Database connection failed', err)
})

// request parser
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// view engine
app.set('view engine', 'ejs')

// define static folder
app.use(express.static(path.join(__dirname, 'public')))

// parse browser cookies
app.use(cookieParser(process.env.COOKIE_SECRET))

// routes
app.use('/', homeRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/:role/dashboard', dashboardRouter)

// 404 error
app.use(notFoundMiddleware)

// error
app.use(defaultErrorMiddleware)

// start app on a specific PORT
app.listen(process.env.PORT, () => {
    console.log(`Application running on http://localhost:${process.env.PORT}`)
})