const express = require('express')
const mentorsRouter = express.Router()
const { getMentorsByAmount, getAllMentors, getMentorById } = require('../controllers/mentorsController.js')

// For getting a specific amount of mentors
mentorsRouter.get('/amount', getMentorsByAmount)

// For getting every mentor
mentorsRouter.get('/', getAllMentors)

// For getting by id
mentorsRouter.get('/:id', getMentorById)

module.exports = mentorsRouter
