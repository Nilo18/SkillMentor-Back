const express = require('express')
const mentorsRouter = express.Router()
const { getMentorsByAmount, getAllMentors, 
getMentorById, addExperience, removeExperience, updateExperiences } = require('../controllers/mentorsController.js')
const authenticate = require('../middleware/authenticate.js')
// import upload from '../multerConfig.js';

// For getting a specific amount of mentors
// Switched to POST because GET can't receive a body
mentorsRouter.post('/amount', getMentorsByAmount)

// Check if the request has the token with it
mentorsRouter.patch('/experiences', authenticate, addExperience)

mentorsRouter.put('/experiences', authenticate, updateExperiences)

// For getting every mentor
mentorsRouter.get('/', getAllMentors)

// For removing a mentor experience by id (mongoose id)
mentorsRouter.delete('/:mentorId/experiences/:experienceId', authenticate, removeExperience)

// For getting by id
mentorsRouter.get('/:id', getMentorById)

module.exports = mentorsRouter
