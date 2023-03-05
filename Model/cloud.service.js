const cloudinary = require('../config/cloudinary')

module.exports = {
    cloud: async (imageTempPath,callBack) => {
       const result =  await cloudinary.uploader.upload(imageTempPath,(err,obj) => {
        console.log(obj.url)
        if(err){
            return callBack(err)
        }
        return callBack(null,obj.url)
       })
    }
}