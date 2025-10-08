// Verification token model to make sure that a new user enters a valid email address
// This token will be used to send an email verification link
const mongoose = require('mongoose')

const verTokenSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
    position: {
        type: String,
        required: true
    },

    token: {
        type: String,
        required: true
    },

    expiry: {
        type: Date,
        required: true
    }
})

const verToken = mongoose.model('verToken', verTokenSchema)
module.exports = verToken