const Slide = require('../models/slide.model.js')

async function getSlides(req, res, next) {
    try {
        const slides = await Slide.find({})
        // We need () here to tell JavaScript to return the object
        const slidesData = slides.map(slide => ({
            image: `https://seefuture-back-a044db68f5d8.herokuapp.com/slider/${slide.image}`,
            text: slide.text
        }))
        return res.status(200).json(slidesData)
    } catch (err) {
        return res.status(500).send("Couldn't get slides: ", err)
    }
}

module.exports = getSlides