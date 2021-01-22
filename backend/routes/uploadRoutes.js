const express = require("express")
const multer = require("multer")
const path = require("path")

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png/
    const extensionName = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extensionName && mimetype) {
        return cb(null, true)
    } else {
        return cb(null, false)
    }
}


const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
})

router.post("/", upload.single("image"), (req, res) => {
    res.send(`/${req.file.path}`)
})

module.exports = router