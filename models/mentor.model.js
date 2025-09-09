const mongoose = require('mongoose')

const experienceSchema = mongoose.Schema({
    company: { 
        type: String,
        required: true
    },

    position: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
})

const mentorSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    }, 

    image: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    position: {
        type: String,
        required: true
    },

    charge: {
        type: String,
        required: true
    },

    experiences: [experienceSchema]
})

const Mentor = mongoose.model('mentor', mentorSchema)
module.exports = Mentor