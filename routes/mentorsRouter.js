const express = require('express')
const mentorsRouter = express.Router()
const { getMentorsByAmount, getAllMentors } = require('../controllers/mentorsController.js')

// For getting a specific amount of mentors
mentorsRouter.get('/amount', getMentorsByAmount)

// For getting every mentor
mentorsRouter.get('/', getAllMentors)

module.exports = mentorsRouter
