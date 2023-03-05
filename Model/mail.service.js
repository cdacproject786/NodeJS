const transporter = require('../config/mail')
module.exports = {
    sendMailTo: async ( TO, SUBJECT, TEXT) => {
        const options = {
            from: process.env.MAIL_USER,
            to: TO,
            subject: SUBJECT,
            text: TEXT
        }

        transporter.sendMail(options, (err, info) => {
            if(err){
                console.log(err);
                return
            }
            console.log("Send : "+info.response)
        })
    }
}