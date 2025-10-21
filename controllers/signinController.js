const createJWT = require('../middleware/jwtCreator.js')
const Mentor = require('../models/mentor.model.js')
const bcrypt = require('bcrypt')

async function signinUser(req, res, next) {
    try {
        const { email, password } = req.body
        const suggestedUser = await Mentor.findOne({email})
        if (!suggestedUser) {
            return res.status(401).json({message: 'მსგავსი მომხმარებელი ვერ მოიძებნა.'})
        }

        const suggestedUserPassword = suggestedUser.password
        const isMatch = await bcrypt.compare(password, suggestedUserPassword)
        if (!isMatch) {
            return res.status(401).json({message: 'გთხოვთ შემოიყვანოთ სწორი პაროლი.'})
        }

        const accessToken = createJWT(
            suggestedUser.id, suggestedUser.image, suggestedUser.name, 
            suggestedUser.email, suggestedUser.password, suggestedUser.position
        )
        return res.status(200).json(accessToken)
    } catch (err) {
        console.log("Couldn't sign the user in: " + err);
        return res.status(500).send("Failed to sign up the user: " + err);
    }
}

module.exports = signinUser