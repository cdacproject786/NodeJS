const pool = require('../config/database')
const { cloud } = require('../Model/cloud.service')

module.exports = {

    createPatientPrimaryService : (image,data,callBack) => {
        pool.execute(   //inserting address info in address table
            `insert into address(address_line_1,user_state,
                city,pincode,country)
            values('${data.address_line_1}','${data.user_state}',
            '${data.city}','${data.pincode}','${data.country}')`,
            (error, addressresult) => {
                if(error){
                    return callBack(error)
                }
                pool.execute(   // selecting address_Id from address table
                    'select address_id from `address` where `address_line_1` = ?',[data.address_line_1],
                    (error, addresult) => {
                        if(error){
                            return callBack(error)
                        }
                        var add_id = addresult[0].address_id
                        cloud(image,(error,imageURL) => { // uploading image to cloudinary
                            if(error){
                                console.log(error)
                            }
                            console.log(imageURL)
                            pool.execute(
                                `insert into patient_primary(profile_photo,fname, lname, 
                                    email, pwd, date_of_birth, 
                                    phone,gender,adhaar_card,
                                    marital_status,occupation,
                                    address_id,
                                    security_questions_answer) 
                                values('${imageURL}','${data.fname}','${data.lname}',
                                '${data.email}','${data.pwd}','${data.date_of_birth}',
                                '${data.phone}','${data.gender}','${data.adhaar_card}',
                                '${data.marital_status}','${data.occupation}',
                                '${add_id}',
                                '${data.security_questions_answer}')`,
                                (error, primaryresult) => {
                                    if(error){
                                        return callBack(error)
                                    }
                                    
                                    return callBack(null,primaryresult)
                                }
                    
                            )
                        })
                    }
                )
            }
        )
    },
    createPatientMedRecordService: (medbody,callBack) => {
        pool.execute(
            `insert into patient_med_record
            (BLOOD_PRESSURE,WEIGHT,SUGAR_LEVEL,BLOOD_GROUP,
                DISABILITY,INSURANCE_ID,INSURANCE_NAME,
                INSURANCE_EXPIRE_DATE,ABHA_NUMBER)
             values
             ('${medbody.blood_pressure}','${medbody.weight}','${medbody.sugar_level}','${medbody.blood_group}',
             '${medbody.disability}','${medbody.insurance_id}','${medbody.insurance_name}',
             '${medbody.insurance_expire_date}','${medbody.abha_number}')`,
            (error,medrecordresult) => {
                if(error){
                    return callBack(error)
                }
                return callBack(null,medrecordresult)
            }
        )
    },
    createPatientMedLogService: (medlogbody,labReport,callBack) => {
        cloud(labReport,(error,labReportImageURL) => { // uploading image to cloudinary
            if(error){
                console.log(error)
            }
            pool.execute(
                `insert into patient_med_log 
                (PRESCRIPTION,LAB_REPORT,DRUG_NAME,
                    MORNING,AFTERNOON,EVENING,UID) 
                values
                ('${medlogbody.prescription}','${labReportImageURL}','${medlogbody.drug_name}',
                '${parseInt(medlogbody.morning)}','${parseInt(medlogbody.afternoon)}','${parseInt(medlogbody.evening)}','${parseInt(medlogbody.uid)}')`,
                (error,logresult) => {
                    if(error){
                        return callBack(error)
                    }
                    return callBack(null,logresult)
                }
            )
            }
        )
    },

    getPatientPrimaryDetailsService: (uid,callBack) => {
        pool.execute(
            `select * from patient_primary where uid = '${uid}'`, 
            (error,primaryresult) => {
                if(error){
                    return callBack(error)
                }
                return callBack(null,primaryresult[0])
            }
        )
    },

    getPatientLoginService : (loginbody,callBack) => {
        pool.execute(
            `select * from patient_primary where email = '${loginbody.email}' and pwd = '${loginbody.pwd}'`,
            (error,loginresult) => {
                if(error){
                    return callBack(error)
                }
                return callBack(null,loginresult[0])
            }
        )
    },

    getPatientMedLogService: (MedLogUID,callBack) => {
        pool.execute(
            `select * from patient_med_log 
            where uid = '${parseInt(MedLogUID)}'`,
            (error, MedLogResult) => {
                if(error){
                    return callBack(error)
                }
                return callBack(null,MedLogResult)
            }
        )
    },

    getPatientMedRecordService: (MedRecordID,callBack) => {
        pool.execute(
            `select * from patient_med_record
            where med_record_id = '${parseInt(MedRecordID)}'`,
            (error,MedRecordResult) => {
                if(error){
                    return callBack(error)
                }
                return callBack(null,MedRecordResult[0])
            }
        )
    },

    forgotPasswordService: (email,callBack) => {
        pool.execute(
            `select * from patient_primary
            where email = '${email}'`,
            (error,emailResult) => {
                if(error){
                    return callBack(error)
                }
                return callBack(null,emailResult[0])
            }
        )
    }
    ,
    addOTP: (otp,email,callBack) => {
        pool.execute(
            `update patient_primary 
            set otp = '${otp}' where email = '${email}'`,
            (error,otpAddResult) => {
                if(error){
                    callBack(error)
                }
                return callBack(null,otpAddResult)
            }
        )
    }
    
        



}