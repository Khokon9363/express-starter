// External dependencies
const express = require('express')

// Internal dependencies
const decorateHTMLResponse = require('../app/http/middlewares/decorateHTML/decorateHTMLResponse')
const { index } = require('../app/http/controllers/home/homeController')

// create router
const router = express.Router()

const pageTitle = 'Home'

router.get('/', decorateHTMLResponse(pageTitle), index)

module.exports = router