const jwt = require('jsonwebtoken')
// const baseURL = 'https://seefuture-back-a044db68f5d8.herokuapp.com'

// profile image
// name
// email
// password
// position
function createJWT(image, name, email, password, position) {
    try {
        const imageURL = `${process.env.BACKEND_URL}/mentors/${image}`
        return jwt.sign({image: imageURL, name, email, password, position}, process.env.JWT_SECRET)
    } catch (err) {
        console.log('JWT creation failed: ', err)
    }
}

module.exports = createJWT