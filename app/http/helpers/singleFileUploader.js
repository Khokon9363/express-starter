// External dependencies
const multer = require("multer")
const path = require("path")
const createHttpError = require("http-errors")

function singleFileUploader(subFolderPath, allowedFiles, maxSize, errorMessage) {
    
    // file upload folder
    const UPLOAD_FOLDER = `./public/storage/${subFolderPath}/`

    // define the storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOAD_FOLDER)
        },
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname)
            const fileName = file.originalname
                                 .replace(fileExt, '')
                                 .toLowerCase()
                                 .split(' ')
                                 .join('-') + '-' + Date.now()
            cb(null, fileName + fileExt)
        }
    })

    // prepare and return the final multer upload object
    return multer({
        storage: storage,
        limits: {
            fileSize: maxSize
        },
        fileFilter: (req, file, cb) => {
            if(allowedFiles.includes(file.mimetype)){
                cb(null, true)
            }else{
                cb(createHttpError(errorMessage))
            }
        }
    })
}

module.exports = singleFileUploader