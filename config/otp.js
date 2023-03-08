const otpGenerator = require('otp-generator')

module.exports.generateOTP = () => {
    const OTP = otpGenerator.generate(6,{
        upperCaseAlphabets : false,
        lowerCaseAlphabets: false,
        specialChars: false
    })
    return OTP
}