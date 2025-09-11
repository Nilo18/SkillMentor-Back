const express = require('express')
const sliderRouter = express.Router()
const getSlides = require('../controllers/sliderController.js')

sliderRouter.get('/', getSlides)

module.exports = sliderRouter