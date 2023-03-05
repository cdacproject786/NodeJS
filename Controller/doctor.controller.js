const { doctorPhotoService,docPatientDetailsService } = require("../Model/doctor.service")

module.exports = {
    doctorPhotoController: (req,res) => {
        console.log(req)
        const image = req.files.photo
        doctorPhotoService( image.tempFilePath, (err,results) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    data: err.message
                })
            }else{
                console.log(results)
                return res.json({
                    success: 1,
                    data: results
                })
            }
        })
    },

    docPatientDetailsController: (req,res) => {
        const patientID = req.body.uid
        docPatientDetailsService( patientID, (err, res) => {
            if(err){
                console.log(err)
                return res.json({
                    success: 0,
                    data: err.message
                })
            }else{
                return res.json({
                    success: 1,
                    data: res
                })
            }
        })
    }
}