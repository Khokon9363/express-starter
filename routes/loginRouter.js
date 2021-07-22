// external dependencies
const express = require('express')

// create router
const router = express.Router()

// internal dependencies
const { guest } = require('../middlewares/common/checkLogin')
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')
const { getLogin, login, logout } = require('../controller/auth/loginController')
const { doLoginValidators, doLoginValidationHandler } = require('../middlewares/login/loginValidators')

// set page title
const page_title = "Login"

// view
router.get('/', decorateHtmlResponse(page_title), guest, getLogin)

// login
router.post('/', decorateHtmlResponse(page_title), doLoginValidators, doLoginValidationHandler, login)

// logout
router.delete('/', logout)

module.exports = router