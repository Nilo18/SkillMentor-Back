const nodemailer = require('nodemailer')
// const { Resend } = require('resend')
// const resend = new Resend(process.env.RESEND_API_KEY)
// const fs = require('fs')
// const { google } = require('googleapis')
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function createTransport(service) {
    return  nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use STARTTLS
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

// createTransport('gmail')

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