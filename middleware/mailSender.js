const nodemailer = require('nodemailer')

function createTransport(service) {
    return nodemailer.createTransport({
        service: `${service}`,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
}

async function sendEmailToVerify(toEmail, subject, html, service) {
    try {
        const transport = createTransport(service)
        // console.log("The transport is: ", transport)

        // html link is receiving undefined in the end, fix that as well
        const options = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            Subject: subject,
            html: html
        }
        // console.log('The options are: ', options)

        await transport.sendMail(options)
    } catch (err) {
        return console.log("Couldn't send verification message: ", err)
    }
}

module.exports = {sendEmailToVerify}