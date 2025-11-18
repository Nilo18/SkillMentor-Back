const express = require('express')
const mentorsRouter = express.Router()
const { 
    getMentorsByAmount, getAllMentors, 
    getMentorById, addExperience, removeExperience, updateExperiences, 
    updateProfileProperty 
} = require('../controllers/mentorsController.js')
const authenticate = require('../middleware/authenticate.js')
const upload = require('../middleware/profImageHandler.js')
// import upload from '../multerConfig.js';

// For getting a specific amount of mentors
// Switched to POST because GET can't receive a body
mentorsRouter.post('/amount', getMentorsByAmount)

// Check if the request has the token with it
mentorsRouter.patch('/experiences', addExperience)

// For updating experiences
mentorsRouter.put('/experiences', authenticate, updateExperiences)

mentorsRouter.patch('/profile', upload.single('image'), updateProfileProperty)

// For getting every mentor
mentorsRouter.get('/', getAllMentors)

// For removing a mentor experience by id (mongoose id)
mentorsRouter.delete('/:mentorId/experiences/:experienceId', authenticate, removeExperience)

// For getting by id
mentorsRouter.get('/:id', getMentorById)

module.exports = mentorsRouter
