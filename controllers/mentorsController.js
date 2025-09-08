const Mentor = require('../models/mentor.model.js')

async function getMentorsByAmount(req, res, next) {
    try {
        const { amount } = req.body
        const requestedAmount = await Mentor.find().limit(amount)
        res.status(200).json(requestedAmount)
    } catch (err) {
        return res.status(500).send("Couldn't get mentors by amount.")
    }
    next()
}

async function getAllMentors(req, res, next) {
    try {
        const mentors = await Mentor.find({})
        res.status(200).json(mentors)
    } catch (err) {
        return res.status(500).send("Couldn't get all of the mentors.")
    }
    next()
}

async function getMentorById(req, res, next) {
    try {
        const givenId = req.params.id
        const match = await Mentor.findById(givenId)
        if (!match) {
            return res.status(401).send("Mentor with such an id doesn't exist.")
        }
        res.status(200).json(match)
    } catch (err) {
        console.log(err)
        return res.status(500).send("Couldn't get mentor by id.")
    }
    next()
}

// async function updateMentor

module.exports = {getMentorsByAmount, getAllMentors, getMentorById}