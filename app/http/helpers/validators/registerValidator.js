// External dependencies
const { check, validationResult } = require("express-validator")
const { unlink } = require('fs')
const createHttpError = require("http-errors")

// Internal dependencies
const People = require('../../../models/People')

const registerValidator = [
    check('name').isLength({min: 1})
                 .withMessage('Name field is required .')
                 .isLength({max: 100})
                 .withMessage('Name field can not container higher than 100 letter')
                 .isAlpha("en-US", {ignore: " -"})
                 .withMessage("Name must not contain anything other than alphabet")
                 .trim(),
    check("email").isLength({min: 1})
                  .withMessage('Email field is required .')
                  .isLength({min: 10})
                  .withMessage('Email field can not contain lower than 10 character.')
                  .isLength({max: 100})
                  .withMessage('Email field can not contain higher than 100 character')
                  .isEmail()
                  .withMessage("Email should be a valid email")
                  .toLowerCase()
                  .trim()
                  .custom(async (value) => { // unique validation
                      try {
                          const people = await People.findOne({email: value})
                          if(people){
                              throw createHttpError("Email already used")
                          }
                      } catch (err) {
                          throw createHttpError(err.message)
                      }
                  }),
    check("phone").isLength({min: 1})
                  .withMessage('Phone field is required .')
                  .isLength({min: 11})
                  .withMessage('Phone field can not contain lower than 11 character.')
            /* Uncomment those 4 lines if you need a bangladeshi real phone number validation
                  .isLength({max: 14})
                  .withMessage('Phone field can not contain higher than 14 character.')
                  .isMobilePhone("bn-BD", {
                          strictMode: true,
                      })
                  .withMessage("Mobile number must be a valid Bangladeshi mobile number")
            */
                  .trim()
                  .custom(async (value) => { // unique validation
                      try {
                          const people = await People.findOne({phone: value})
                          if(people){
                              throw createHttpError("Phone already used")
                          }
                      } catch (err) {
                          throw createHttpError(err.message)
                      }
                  }),
    check("password").isLength({min: 1})
                     .withMessage('Password field is required .')
                     .isLength({min: 8})
                     .withMessage('Password field can not contain lower than 8 character.')
                     .isLength({max: 32})
                     .withMessage('Password field can not contain higher than 32 character.')
                     .trim()
                     .custom(async (value, {req}) => {
                            try {
                                if(req.body.password_confirmation.trim() !== value){
                                    throw createHttpError("Password & confirm password does not match !")
                                }
                            } catch (err) {
                                throw createHttpError(err.message)
                            }
                        })
                /* Uncomment those 2 lines if you need a strong password validation
                     .isStrongPassword()
                     .withMessage('Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol.')
                */
]

function registerValidatorChecker(req, res, next) {
    const errors = validationResult(req)
    const mappedErrors = errors.mapped()
    
    if(Object.keys(mappedErrors).length === 0){
        next()
    }else{
        
        // remove uploaded files
        if (req.files.length > 0) {
            const { filename } = req.files[0]
            unlink(`./public/storage/avatars/${filename}`, (err) => {
                    if (err) console.log(err)
                }
            )
        }

        // response the mapped error
        if(res.locals.html){
            res.locals.data = req.body
            res.locals.errors = mappedErrors
            res.render('auth/register')
        }else{
            res.status(500).json({
                data: req.body,
                errors: mappedErrors
            })
        }
    }
}

module.exports = {
    registerValidator,
    registerValidatorChecker
}