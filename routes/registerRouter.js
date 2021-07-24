// External dependencies
const express = require('express')

// Internal dependencies
const decorateHTMLResponse = require('../app/http/middlewares/decorateHTML/decorateHTMLResponse')
const { index, register } = require('../app/http/controllers/auth/register/registerController')
const avatarUpload = require('../app/http/helpers/file_uploads/avatarUpload')
const { registerValidator, registerValidatorChecker } = require('../app/http/helpers/validators/registerValidator')
const { guest } = require('../app/http/middlewares/authOrGuest/authOrGuest')

// create router
const router = express.Router()

const pageTitle = 'Register'

router.get('/', decorateHTMLResponse(pageTitle), guest, index)

router.post('/', decorateHTMLResponse(pageTitle), guest, avatarUpload, registerValidator, registerValidatorChecker, register)

module.exports = router