// external dependencies
const express = require('express')

// create router
const router = express.Router()

// internal dependencies
const { checkLogin } = require('../middlewares/common/checkLogin')
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')
const { getInbox } = require('../controller/inboxController')

// login routes
router.get('/',decorateHtmlResponse('Inbox'), checkLogin, getInbox)

module.exports = router