// External dependencies
const express = require('express')

// Internal dependencies
const decorateHTMLResponse = require('../app/http/middlewares/decorateHTML/decorateHTMLResponse')
const { index, login, logout } = require('../app/http/controllers/auth/login/loginController')
const { auth, guest } = require('../app/http/middlewares/authOrGuest/authOrGuest')
const { loginValidator, loginValidatorChecker } = require('../app/http/helpers/validators/loginValidator')

// create router
const router = express.Router()

const pageTitle = 'Login'

router.get('/', decorateHTMLResponse(pageTitle), guest, index)
router.post('/', decorateHTMLResponse(pageTitle), guest, loginValidator, loginValidatorChecker, login)

router.post('/logout', auth, logout)

module.exports = router