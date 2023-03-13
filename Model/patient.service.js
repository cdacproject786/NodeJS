const pool = require('../config/database')
const { cloud } = require('../Model/cloud.service')

module.exports = {
    otpValidateService: (body,callBack) => {
        pool.execute(
            `select * from patient_primary 
            where email='${body.email}' and otp='${body.otp}'`,
            (error,result) => {
                if(error){
                    callBack(error)
                }
                return callBack(null,result[0])
            }
        )
    },

    resetPasswordService: (body,callBack) =>{
        pool.execute(
            `update patient_primary 
            set pwd=${body.pwd}
            where email=${body.email}`,
            (error,resetPwd) => {
                if(error){
                    callBack(error)
                }
                return callBack(null,resetPwd)
            }
        )
    },
    updateProfileWithoutPhotoService: (data, callBack) => {
        pool.execute(   //inserting address info in address table
            `update address
            set address_line_1 = '${data.address_line_1}' , user_state = '${data.user_state}',
                city = '${data.city}',pincode = '${data.pincode}' ,country = '${data.country}'
                where address_id = '${data.address_id}'`,
            (error, updateaddressresult) => {
                if (error) {
                    return callBack(error)
                }
                pool.execute(
                    `update patient_primary
                    set fname = '${data.fname}', lname = '${data.lname}', 
                        email = '${data.email}', date_of_birth = '${data.date_of_birth}', 
                        phone = '${data.phone}',gender = '${data.gender}',adhaar_card = '${data.adhaar_card}',
                        marital_status = '${data.marital_status}',occupation = '${data.occupation}'
                        where uid = '${data.uid}'`,
                    (error, updateprimaryresult) => {
                        if (error) {
                            return callBack(error)
                        }

                        return callBack(null, updateprimaryresult)
                    }

                )

            }
        )
    },
    updateProfileWithPhotoService: ( data, callBack) => {
        pool.execute(   //inserting address info in address table
            `update address
            set address_line_1 = '${data.address_line_1}' , user_state = '${data.user_state}',
                city = '${data.city}',pincode = '${data.pincode}' ,country = '${data.country}'
                where address_id = '${data.address_id}'`,
            (error, updateaddressresult) => {
                if (error) {
                    return callBack(error)
                }
                const imageresult = cloud(data.profile_photo, (error,result) => {
                    if(error){
                        console.log(error)
                    }else{
                        console.log("Image Url -> ")
                        console.log(result)
                        pool.execute(
                            `update patient_primary
                            set fname = '${data.fname}', lname = '${data.lname}', 
                                email = '${data.email}', date_of_birth = '${data.date_of_birth}', 
                                phone = '${data.phone}',gender = '${data.gender}',adhaar_card = '${data.adhaar_card}',
                                marital_status = '${data.marital_status}',occupation = '${data.occupation}',
                                profile_photo = '${result}'
                                where uid = '${data.uid}'`,
                            (error, updateprimaryresult) => {
                                if (error) {
                                    return callBack(error)
                                }
        
                                return callBack(null, updateprimaryresult)
                            }
        
                        )
                    }
                })
                

            }
        )
    },
    createPatientPrimaryService: (data, callBack) => {
        pool.execute(   //inserting address info in address table
            `insert into address(address_line_1,user_state,
                city,pincode,country)
            values('${data.address_line_1}','${data.user_state}',
            '${data.city}','${data.pincode}','${data.country}')`,
            (error, addressresult) => {
                if (error) {
                    return callBack(error)
                }
                pool.execute(   // selecting address_Id from address table
                    'select address_id from `address` where `address_line_1` = ?', [data.address_line_1],
                    (error, addresult) => {
                        if (error) {
                            return callBack(error)
                        }
                        var add_id = addresult[0].address_id
                        pool.execute(
                            `insert into patient_primary(fname, lname, 
                                    email, pwd, date_of_birth, 
                                    phone,gender,adhaar_card,
                                    marital_status,occupation,
                                    address_id,
                                    security_questions_answer) 
                                values('${data.fname}','${data.lname}',
                                '${data.email}','${data.pwd}','${data.date_of_birth}',
                                '${data.phone}','${data.gender}','${data.adhaar_card}',
                                '${data.marital_status}','${data.occupation}',
                                '${add_id}',
                                '${data.security_questions_answer}')`,
                            (error, primaryresult) => {
                                if (error) {
                                    return callBack(error)
                                }

                                return callBack(null, primaryresult)
                            }

                        )
                    })
            }
        )
    },
    createPatientMedRecordService: (medbody, callBack) => {
        pool.execute(
            `insert into patient_med_record
            (BLOOD_PRESSURE,WEIGHT,SUGAR_LEVEL,BLOOD_GROUP,
                DISABILITY,INSURANCE_ID,INSURANCE_NAME,
                INSURANCE_EXPIRE_DATE,ABHA_NUMBER,UID)
             values
             ('${medbody.blood_pressure}','${medbody.weight}','${medbody.sugar_level}','${medbody.blood_group}',
             '${medbody.disability}','${medbody.insurance_id}','${medbody.insurance_name}',
             '${medbody.insurance_expire_date}','${medbody.abha_number}','${medbody.uid}')`,
            (error, medrecordresult) => {
                if (error) {
                    return callBack(error)
                }
                
                return callBack(null,medrecordresult)
            }
        )
    },
    createPatientMedLogService: (medlogbody, labReport, callBack) => {
        cloud(labReport, (error, labReportImageURL) => { // uploading image to cloudinary
            if (error) {
                console.log(error)
            }
            pool.execute(
                `insert into patient_med_log 
                (PRESCRIPTION,LAB_REPORT,DRUG_NAME,
                    MORNING,AFTERNOON,EVENING,UID) 
                values
                ('${medlogbody.prescription}','${labReportImageURL}','${medlogbody.drug_name}',
                '${parseInt(medlogbody.morning)}','${parseInt(medlogbody.afternoon)}','${parseInt(medlogbody.evening)}','${parseInt(medlogbody.uid)}')`,
                (error, logresult) => {
                    if (error) {
                        return callBack(error)
                    }
                    return callBack(null, logresult)
                }
            )
        }
        )
    },

    getPatientPrimaryDetailsService: (uid, callBack) => {
        pool.execute(
            `select * from patient_primary where uid = '${uid}'`,
            (error, primaryresult) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, primaryresult[0])
            }
        )
    },
    getPatientAddressDetailsService: (add_id, callBack) => {
        pool.execute(
            `select * from address where address_id = '${add_id}'`,
            (error, addressresult) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, addressresult[0])
            }
        )
    },

    getPatientLoginService: (loginbody, callBack) => {
        pool.execute(
            `select * from patient_primary where email = '${loginbody.email}' and pwd = '${loginbody.pwd}'`,
            (error, loginresult) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, loginresult[0])
            }
        )
    },

    getPatientMedLogService: (MedLogUID, callBack) => {
        pool.execute(
            `select * from patient_med_log 
            where uid = '${parseInt(MedLogUID)}'`,
            (error, MedLogResult) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, MedLogResult)
            }
        )
    },

    getPatientMedRecordService: (uid, callBack) => {
        pool.execute(
            `select * from patient_med_record
            where uid = '${parseInt(uid)}'`,
            (error, MedRecordResult) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, MedRecordResult[0])
            }
        )
    },

    forgotPasswordService: (email, callBack) => {
        pool.execute(
            `select * from patient_primary
            where email = '${email}'`,
            (error, emailResult) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, emailResult[0])
            }
        )
    }
    ,
    addOTP: (otp, email, callBack) => {
        pool.execute(
            `update patient_primary 
            set otp = '${otp}' where email = '${email}'`,
            (error, otpAddResult) => {
                if (error) {
                    callBack(error)
                }
                return callBack(null, otpAddResult)
            }
        )
    }





}