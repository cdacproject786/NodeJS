const { cloud } = require('../config/cloudinary')
const pool = require('../config/database')

module.exports = {
    doctorPhotoService: (image,callBack) => {
        cloud(image,(error, imageURL) => {
            if(error){
                return callBack(error)
            }
            
            return callBack(null,imageURL)
                    
            
            
        })
    },

    docPatientDetailsService: (patientID, callBack) => {
        pool.execute(
            `select * from patient_primary
            where uid = '${patientID}'`,
            (err, result) => {
                if(err){
                    return callBack(err)
                }
                return callBack(null, result)
            }
        )
    }
}