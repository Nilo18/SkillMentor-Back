const jwt = require('jsonwebtoken')

// profile image
// name
// email
// password
// position
function createJWT(image, name, email, password, position) {
    try {
        return jwt.sign({image, name, email, password, position}, process.env.JWT_SECRET)
    } catch (err) {
        console.log('JWT creation failed: ', err)
    }
}

module.exports = createJWT