const { createPatientPrimaryController, patientLoginController , getPatientPrimaryDetailsController, createPatientMedLogController, createPatientMedRecordController } = require('../Controller/patient.controller')
const { checkToken } = require('../auth/token_validation')
const router = require('express').Router()

//insert
router.post('/patient/register', createPatientPrimaryController)
router.post('/patient/login', patientLoginController) //JWT generated
router.post('patient/medlogINS',checkToken, createPatientMedLogController) // JWT validation
router.post('patient/medrecordINS',checkToken, createPatientMedRecordController) // JWT validation

//retrieve
router.get('/patient/getPatientPrimaryDetails/:id', checkToken, getPatientPrimaryDetailsController)  // JWT validation
router.get('/patient/getMedRecordDetails/:id',checkToken,) // JWT validation

module.exports = router;