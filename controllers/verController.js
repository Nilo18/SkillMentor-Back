const verToken = require('../models/verToken.model.js')
const createJWT = require('../middleware/jwtCreator.js')
const Mentor = require('../models/mentor.model.js')

async function verifyEmail(req, res, next) {
    try {
        const givenVerToken = req.params.token
        const storedVerToken = await verToken.findOne({token: givenVerToken})

        if (!storedVerToken) {
            return res.status(401).json({message: 'Invalid verification token.'})
        }

        if (storedVerToken.expiry < Date.now()) {
            return res.status(401).json({message: 'Verification token has expired.'})
        }

        // Charge and experiences array should be initiliazed here as '0' and an empty array respectively

        const charge = '0' // Set the initial charge of the mentor
        const experiences = [] // Set the experiences as empty initially

        // The user data like email, profileImage, name, etc. should be accessed from the verification token
        // And it should all be passed to User.create() along with locally created charge and experiences array
        const newMentor = await Mentor.create({
            id: storedVerToken.userId,
            name: storedVerToken.name,
            email: storedVerToken.email,
            image: storedVerToken.image,
            password: storedVerToken.password,
            position: storedVerToken.position,
            charge: charge,
            experiences: experiences
        })
        console.log('The new mentor is: ', newMentor)

        // After that JWT token should be created and sent back (Separate function is needed for this)
        const accessToken = createJWT(
            storedVerToken.image, storedVerToken.name, storedVerToken.email, storedVerToken.password, storedVerToken.position
        )

        return res.status(200).json({accessToken})
    } catch (err) {
        // console.log(err)
        return res.status(500).json("Couldn't verify email: " + err)
    }
}

module.exports = verifyEmail