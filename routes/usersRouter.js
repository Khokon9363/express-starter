// external dependencies
const express = require('express')

// create router
const router = express.Router()

// internal dependencies
const { checkLogin } = require('../middlewares/common/checkLogin')
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')
const avatarUpload = require('../middlewares/users/avatarUpload')
const { addUserValidators, addUserValidationHandler } = require('../middlewares/users/userValidators')
const { getUsers, addUser, removeUser } = require('../controller/usersController')

// get routes
router.get('/', decorateHtmlResponse('Users'), checkLogin, getUsers)

// store user
router.post('/', checkLogin, avatarUpload, addUserValidators, addUserValidationHandler, addUser)

// destroy user
router.delete('/:id', checkLogin, removeUser)

module.exports = router