const { doctorPhotoController, docPatientDetailsController } = require('../Controller/doctor.controller')

const router = require('express').Router()

router.post('/doctor/photo', doctorPhotoController)
router.get('/doctor/:patientID', docPatientDetailsController)