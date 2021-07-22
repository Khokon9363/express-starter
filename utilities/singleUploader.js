const createError = require("http-errors")
const multer = require("multer")
const path = require('path')

function uploader(sub_folder_path, allowed_file_types, max_size, error_message) {
    
    // file upload folder
    const UPLOADS_FOLDER = `${__dirname}/../public/uploads/${sub_folder_path}/`

    // define the storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_FOLDER)
        },
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname)
            const fileName = file.originalname
                                 .replace(fileExt, "")
                                 .toLowerCase()
                                 .split(" ")
                                 .join("-") + "-" + Date.now()
            cb(null, fileName + fileExt)
        }
    })

    // prepare the final multer upload object
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: max_size
        },
        fileFilter: (req, file, cb) => {
            if(allowed_file_types.includes(file.mimetype)){
                cb(null, true)
            }else{
                cb(createError(error_message))
            }
        }
    })

    return upload
}

module.exports = uploader