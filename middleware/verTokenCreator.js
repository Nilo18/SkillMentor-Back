const crypto = require('crypto')
const verToken = require('../models/verToken.model.js')

async function createVerToken(userId, name, image, email, password, position) {
    try {
        const token = crypto.randomBytes(32).toString('hex')
        const expiry = new Date(Date.now() + 15 * 60 * 1000)
        const newVerToken = await verToken.create({userId, name, image, email, password, position, token, expiry: expiry})
        return newVerToken
    } catch (err) {
        console.log("Couldn't create verToken: ", err)
    }
}

module.exports = createVerToken