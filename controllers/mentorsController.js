const Mentor = require('../models/mentor.model.js')

async function getMentorsByAmount(req, res, next) {
    try {
        const { amount } = req.body
        const requestedAmount = await Mentor.find().limit(amount)
        // Make a copy of the received array to avoid sending multiple requests by looping over it and then sending each
        const mentorsData = requestedAmount.map(mentor => ({
            _id: mentor._id,
            id: mentor.id,
            image: `http://localhost:5000/mentors/${mentor.image}`,
            name: mentor.name,
            position: mentor.position,
            charge: mentor.charge,
            experiences: mentor.experiences
        }));

        res.status(200).json({mentorsData})
    } catch (err) {
        return res.status(500).send("Couldn't get mentors by amount.")
    }
    // next() don't call next to prevent other controllers running alongside this one
}

async function getAllMentors(req, res, next) {
    try {
        const mentors = await Mentor.find({})
        // Make a copy of the received array to avoid sending multiple requests by looping over it and then sending each
        const mentorsData = mentors.map(mentor => ({
            _id: mentor._id,
            id: mentor.id,
            image: `http://localhost:5000/mentors/${mentor.image}`,
            name: mentor.name,
            position: mentor.position,
            charge: mentor.charge,
            experiences: mentor.experiences
        }));
        res.status(200).json(mentorsData)
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
        res.status(200).json({
            _id: match._id,
            id: match.id,
            // Access the static image, if we don't specify the route like this, the frontend won't be able to access the image
            // Unless we store it there as well and if we store it there as well, the purpose of the backend will be defeated.
            image: `http://localhost:5000/mentors/${match.image}`, 
            name: match.name,
            position: match.position,
            charge: match.charge,
            experiences: match.experiences,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send("Couldn't get mentor by id.")
    }
    next()
}

// async function updateMentor

module.exports = {getMentorsByAmount, getAllMentors, getMentorById}