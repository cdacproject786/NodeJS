const multer = require('multer')
const cloudinary = require('../config/cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const DIR = '../public/'

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder : "Profiles"
    }
})

const upload = multer({storage: storage})

module.exports = upload