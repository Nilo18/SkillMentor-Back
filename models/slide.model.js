const mongoose = require('mongoose')

const slideSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true
    }
})

const Slide = mongoose.model('slide', slideSchema)
module.exports = Slide