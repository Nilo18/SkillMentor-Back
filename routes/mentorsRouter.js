const express = require('express')
const mentorsRouter = express.Router()
const { getMentorsByAmount } = require('../controllers/mentorsController.js')

mentorsRouter.get('/amount', getMentorsByAmount)

module.exports = mentorsRouter
