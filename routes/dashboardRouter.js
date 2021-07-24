// External dependencies
const express = require('express')

// Internal dependencies
const decorateHTMLResponse = require('../app/http/middlewares/decorateHTML/decorateHTMLResponse')
const { index } = require('../app/http/controllers/dashboard/dashboardController')
const { auth } = require('../app/http/middlewares/authOrGuest/authOrGuest')

// create router
const router = express.Router()

const pageTitle = 'Dashboard'

router.get('/', decorateHTMLResponse(pageTitle), auth, index)

module.exports = router