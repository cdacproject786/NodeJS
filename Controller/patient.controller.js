const { createPatientPrimaryService, getPatientLoginService, getPatientPrimaryDetailsService, createPatientMedRecordService, createPatientMedLogService, getPatientMedLogService, getPatientMedRecordService, forgotPasswordService, addOTP } = require('../Model/patient.service')
const { SHA1 } = require('crypto-js')
const { sign } = require('jsonwebtoken')

const { sendMailTo } = require('../Model/mail.service')
const { generateOTP } = require('../config/otp')
module.exports = {

    createPatientPrimaryController: (req, res) => {
        console.log(req.body)
        const image = req.files.profile_photo
        const body = req.body
        body.pwd = '' + SHA1(body.pwd)
        console.log(image.tempFilePath)
        createPatientPrimaryService(image.tempFilePath, body, (err, primaryResult) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                })
            }
            else {
                var TO = body.email
                var SUBJECT = "Patient Registration"
                var TEXT = `Kindly informing you Mist/Miss ${body.fname} ${body.lname} Your Account on Med History App is Successfully Registered`
                sendMailTo(TO, SUBJECT, TEXT)
                return res.status(200).json({
                    success: 1,
                    data: primaryResult

                })
            }
        })
    },

    createPatientMedRecordController: (req, res) => {
        const medRecordBody = req.body
        createPatientMedRecordService(medRecordBody, (err, medRecordResult) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: err
                })
            }
            return res.status(200).json({
                success: 1,
                data: medRecordResult
            })
        })

    },

    createPatientMedLogController: (req, res) => {
        const medLogBody = req.body
        const labReportImage = req.files.lab_report
        createPatientMedLogService(medLogBody, labReportImage.tempFilePath, (err, medLogResult) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: err
                })
            }
            return res.status(200).json({
                success: 1,
                data: medLogResult
            })
        })

    },

    getPatientPrimaryDetailsController: (req, res) => {
        console.log(req.body)
        const uid = req.params.id
        getPatientPrimaryDetailsService(uid, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: "Data not found"
                })
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                })
            }
            else {
                return res.status(200).json({
                    success: 1,
                    data: results
                })
            }
        })
    },

    getPatientMedLogController: (req, res) => {
        const MedLogUID = req.params.id
        getPatientMedLogService(MedLogUID, (err, MedLogResult) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: err
                })
            }
            if (!MedLogResult) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                })
            }
            return res.status(200).json({
                success: 1,
                data: MedLogResult
            })
        })
    },

    getPatientMedRecordController: (req, res) => {
        
        const MedRecordID = req.params.id
        getPatientMedRecordService(MedRecordID, (err, MedRecordResult) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: err
                })
            }
            if (!MedRecordResult) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                })
            }
            return res.status(200).json({
                success: 1,
                data: MedRecordResult
            })
        })
    },



    patientLoginController: (req, res) => {
        console.log(req.body)
        const body = req.body
        body.pwd = '' + SHA1(body.pwd)
        getPatientLoginService(body, (err, results) => {
            if (err) {
                return res.status(400).json({
                    success: 0,
                    message: err
                })
            }
            if (!results) {
                return res.sendStatus(401)
            }

            if (results) {
                const uid = results.UID
                results.pwd = undefined
                //create JWT
                const accessToken = sign({ "email": body.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
                const refreshToken = sign({ result : results }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
                //create column for refreshToken in patient_primary to save refreshToken
                //service function to save refreshToken in patient_primary
                
                
                //sending cookie through httpOnly so it can't be accessed by javascript
                res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })// 1 day
                res.status(200).json({ accessToken, uid })
            } else {
                return res.sendStatus(401)
            }
        })
    },

    forgotPasswordController: (req,res) => {
        const email = req.body.email
        forgotPasswordService(email, (err, forgotResult) => {
            if(err){
                res.sendStatus(500)
            }
            if(!forgotResult){
                res.sendStatus(404)
            }
            if(forgotResult){
                otpGenerated = generateOTP()
                addOTP(otpGenerated,email,(err,addOTPResult) => {
                    if(err){
                        res.sendStatus(500)
                    }
                    var TO = email
                    var SUBJECT = "MedLog Registration Forgot Password"
                    var TEXT = `OTP for forgot password is {${otpGenerated}}.`
                    sendMailTo(TO, SUBJECT, TEXT)
                })
            }
        })
    }


}