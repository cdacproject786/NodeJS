const { resetPasswordService,otpValidateService,getPatientAddressDetailsService, updateProfileWithoutPhotoService,updateProfileWithPhotoService,createPatientPrimaryService, getPatientLoginService, getPatientPrimaryDetailsService, createPatientMedRecordService, createPatientMedLogService, getPatientMedLogService, getPatientMedRecordService, forgotPasswordService, addOTP } = require('../Model/patient.service')
const { SHA1 } = require('crypto-js')
const { sign } = require('jsonwebtoken')

const { sendMailTo } = require('../Model/mail.service')
const { generateOTP } = require('../config/otp')
module.exports = {
    resetPasswordController: (req,res) =>{
        const body=req.body
        body.pwd = '' + SHA1(body.pwd)
            resetPasswordService(body,(err,resetPwd) => {
                if(err){
                    res.sendStatus(500)
                }
                else
                var TO = body.email
                var SUBJECT = "Reset Password Succecssfully"
                var TEXT = `Mrs/Mr ${body.fname} ${body.lname} your password updated Successfully.`
                sendMailTo(TO, SUBJECT, TEXT)
            })

      
    },
    otpValidateController: (req,res) =>{
        const body = req.body
        otpValidateService(body, (err, result) => {
            if(err){
                res.sendStatus(400)
            }
            if(!result){
                res.sendStatus(401) 
            }
            if(result){
               res.status(200).json(result)
               
            }
        })
    },
    updateProfileController: (req,res) => {
        const body = req.body
        if(req.files.profile_photo){
            const image = req.files.profile_photo
            updateProfileWithPhotoService(image.tempFilePath,body, (err, updateProfileWithPhotoResult) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500)
                }
                return res.status(201).json(updateProfileWithPhotoResult)
            })
        }
        if(!req.files.profile_photo){
            updateProfileWithoutPhotoService(body, (err, updateProfileWithoutPhotoResult) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500)
                }
                return res.status(201).json(updateProfileWithoutPhotoResult)
            })
        }
        
    },
    createPatientPrimaryController: (req, res) => {
        console.log(req.body)
        /*
        const image = req.files.profile_photo */
        const body = req.body
        body.pwd = '' + SHA1(body.pwd)
        /* console.log(image.tempFilePath) */
        createPatientPrimaryService(/* image.tempFilePath ,*/ body, (err, primaryResult) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            else {
                var TO = body.email
                var SUBJECT = "Patient Registration"
                var TEXT = `Kindly informing you Mist/Miss ${body.fname} ${body.lname} Your Account on Med History App is Successfully Registered`
                sendMailTo(TO, SUBJECT, TEXT)
                return res.status(201).json(primaryResult)
            }
        })
    },

    createPatientMedRecordController: (req, res) => {
        console.log(req.body)
        const medRecordBody = req.body
        createPatientMedRecordService(medRecordBody, (err, medRecordResult) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            return res.status(201).json(medRecordResult)
        })

    },

    createPatientMedLogController: (req, res) => {
        const medLogBody = req.body
        const labReportImage = req.files.lab_report
        createPatientMedLogService(medLogBody, labReportImage.tempFilePath, (err, medLogResult) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            return res.status(201).json(medLogResult)
        })

    },

    getPatientPrimaryDetailsController: (req, res) => {
        console.log("getPrimary")
        console.log(req.params)
        const uid = req.params.id
        getPatientPrimaryDetailsService(uid, (err, PrimaryDetailsResult) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            if (!PrimaryDetailsResult) {
                return res.sendStatus(404)
            }
            else {
                return res.status(200).json(PrimaryDetailsResult)
            }
        })
    },
    getPatientAddressDetailsController: (req, res) => {
        console.log("getAddress")
        console.log(req.params)
        const add_id = req.params.id
        getPatientAddressDetailsService(add_id, (err, AddressDetailsResult) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            if (!AddressDetailsResult) {
                return res.sendStatus(404)
            }
            else {
                return res.status(200).json(AddressDetailsResult)
            }
        })
    },

    getPatientMedLogController: (req, res) => {
        const MedLogUID = req.params.id
        getPatientMedLogService(MedLogUID, (err, MedLogResult) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            if (!MedLogResult) {
                return res.sendStatus(404)
            }
            return res.status(200).json(MedLogResult)
        })
    },

    getPatientMedRecordController: (req, res) => {
        console.log("MedID -->")
        console.log(req.params)
        const uid = req.params.id
        getPatientMedRecordService(uid, (err, MedRecordResult) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            if (!MedRecordResult) {
                return res.sendStatus(404)
            }
            return res.status(200).json(MedRecordResult)
        })
    },



    patientLoginController: (req, res) => {
        console.log(req.body)
        const body = req.body
        body.pwd = '' + SHA1(body.pwd)
        getPatientLoginService(body, (err, results) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            if (!results) {
                return res.sendStatus(401)
            }
            if (results) {
                const uid = results.UID
                const medrecordid = results.MED_RECORD_ID
                results.pwd = undefined
                //create JWT
                const accessToken = sign({ "email": body.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
                //const refreshToken = sign({ result : results }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
                //create column for refreshToken in patient_primary to save refreshToken
                //service function to save refreshToken in patient_primary
                
                
                //sending cookie through httpOnly so it can't be accessed by javascript
                //res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })// 1 day
                res.status(200).json({ accessToken, uid, medrecordid })
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