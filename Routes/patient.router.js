const { resetPasswordController,otpValidateController,updateProfileController ,forgotPasswordController, createPatientPrimaryController, patientLoginController , getPatientPrimaryDetailsController, createPatientMedLogController, createPatientMedRecordController, getPatientMedRecordController, getPatientMedLogController, getPatientAddressDetailsController } = require('../Controller/patient.controller')
const { checkToken } = require('../auth/token_validation')
const upload = require('../config/multer')
const router = require('express').Router()

//insert
router.post("/patient/register", createPatientPrimaryController)
router.post('/patient/login', patientLoginController) //JWT generated
router.post('/patient/medlogINS',checkToken, createPatientMedLogController) // JWT validation
router.post('/patient/medrecordINS',checkToken, createPatientMedRecordController) // JWT validation

//retrieve
router.get('/patient/getPatientPrimaryDetails/:id', checkToken, getPatientPrimaryDetailsController)  // JWT validation
router.get('/patient/getaddressDetails/:id', checkToken, getPatientAddressDetailsController)
router.get('/patient/getMedRecordDetails/:id',checkToken, getPatientMedRecordController) // JWT validation
router.get('/patient/getMedLogDetails/:id', checkToken, getPatientMedLogController)

//update
router.post('/patient/updateProfile',checkToken,updateProfileController)



/* 
router.post('/patient/upload',upload.single("profile"),async(req,res) => {
    console.log("Profile URL --> ")
    console.log(req.file.path)
    res.json({picture:req.file.path})
}) */


//forgot password
router.post('/patient/forgotPassword',forgotPasswordController)//genertes otp
router.post('/patient/otpValidate',otpValidateController)//validates otp
router.post('/patient/resetPassword',resetPasswordController)//update password



module.exports = router;