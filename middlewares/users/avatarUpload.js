const uploader = require('../../utilities/singleUploader')

function avatarUpload(req, res, next) {
    const upload = uploader("avatars", ["image/jpg", "image/jpeg", "image/png"], 1000000, "Only jpg, png & jpeg format allowed !")

    // call the middleware function
    upload.any()(req, res, (err) => {
        if(err){
            res.status(500).json({
                errors: {
                    avatar: {
                        message: err.message
                    }
                }
            })
        }else{
            next()
        }
    })
}

module.exports = avatarUpload