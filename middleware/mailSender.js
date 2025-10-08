const nodemailer = require('nodemailer')
require('dotenv').config()

function createTransport(service) {
    // console.log(process.env.EMAIL_USER)
    // console.log(process.env.EMAIL_PASS)
    return nodemailer.createTransport({
        service: `${service}`,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
}

createTransport('gmail')

async function sendEmailToVerify(toEmail, subject, html, service) {
    try {
        const transport = createTransport(service)
        console.log("The transport is: ", transport)

        // html link is receiving undefined in the end, fix that as well
        const options = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: subject,
            html: html
        }
        console.log('The options are: ', options)

        const info = await transport.sendMail(options);
        console.log('Email sent: ', info.messageId);
    } catch (err) {
        return console.log("Couldn't send verification message: ", err)
    }
}

module.exports = {sendEmailToVerify}