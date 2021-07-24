// Internal dependencies
const singleFileUploader = require("../singleFileUploader")

function avatarUpload(req, res, next) {
    const upload = singleFileUploader('avatars', ["image/jpg", "image/jpeg", "image/png"], 1000000, '"Only jpg, png & jpeg format allowed !"')

    // call the default function of a multer upload object any()
    upload.any()(req, res, (err) => {
        if(err){
            if(res.locals.html){
                res.locals.data = req.body
                res.locals.errors.avatar = {msg: err.message}
                res.render('auth/register')
            }else{
                res.status(500).json({
                    errors: {
                        avatar: {
                            message: err.message
                        }
                    }
                })
            }
        }else{
            next()
        }
    })
}

module.exports = avatarUpload