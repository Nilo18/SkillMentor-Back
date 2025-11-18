const Mentor = require('../models/mentor.model.js')
const bcrypt = require('bcrypt')
const createVerToken = require('../middleware/verTokenCreator.js')
const { sendEmailToVerify } = require('../middleware/mailSender.js')

async function sendEmailVerification(toEmail, verToken) {
    console.log('The received verToken is: ', verToken)
    console.log('The received token inside verToken object is: ', verToken.token)
    const verificationLink = `${process.env.BASE_URL}/verify-email/${verToken.token}`
    const htmlMsg = `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    await sendEmailToVerify(toEmail, 'შეამოწმეთ ელ–ფოსტა', htmlMsg, 'gmail')
}

async function signupUser(req, res, next) {
    try {
        const { name, email, position, password } = req.body
        const profileImage = req.file ? req.file.path : null // Retrieve the image name so we can save it into the db
        const mentorWithSameEmail = await Mentor.findOne({email})

        if (mentorWithSameEmail) {
            return res.status(403).json({message: 'გთხოვთ შემოიყვანოთ განსხვავებული ელ–ფოსტა'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const id = Date.now().toString()

        const verToken = await createVerToken(id, name, profileImage, email, hashedPassword, position)
        await sendEmailVerification(email, verToken)

        return res.status(200).json({message: 'Signup successful! Please check your email to verify'})
    } catch (err) {
        console.log("Failed to sign up: ", err)
        return res.status(500).send("Couldn't sign up the user: ", err.message)
    }
}

module.exports = signupUser