// external dependencies
const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

// internal dependencies
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/common/errorMiddleware')
const loginRouter = require('./routes/loginRouter')
const inboxRouter = require('./routes/inboxRouter')
const usersRouter = require('./routes/usersRouter')

// initialize project
const app = express()
dotenv.config()

// Database connection
mongoose.connect((process.env.MONGO_CONNECTION_STRING), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
}).catch((err) => {
    console.log(err)
})

// request parser
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// view engine setup
app.set('view engine', 'ejs')

// define static folder
app.use(express.static(path.join(__dirname, 'public')))

// parse browser cookies
app.use(cookieParser(process.env.COOKIE_SECRET))

// routes
app.use('/', loginRouter)
app.use('/inbox', inboxRouter)
app.use('/users', usersRouter)

// 404 error handling
app.use(notFoundMiddleware)

// error handling
app.use(errorMiddleware)

// start application on the specific PORT
app.listen(process.env.PORT, () => {
    console.log(`Application running on http://localhost:${process.env.PORT}`)
})