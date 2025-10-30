const { isValidObjectId, Mongoose } = require('mongoose');
const Mentor = require('../models/mentor.model.js')
const baseURL = 'https://seefuture-back-a044db68f5d8.herokuapp.com'

// This function will check if the image is being served statically or dynamically
// It is used to avoid URL conflicts on image property
function getMentorImage(image) {
  if (!image) return '/mentors/default.jpg'; // fallback image
  if (image.startsWith('http')) return image; // Cloudinary full URL
  return `${process.env.BACKEND_URL}/mentors/${image}`; // static file
};

async function getMentorsByAmount(req, res, next) {
    try {
        const { amount } = req.body
        const requestedAmount = await Mentor.find().limit(amount)
        // Make a copy of the received array to avoid sending multiple requests by looping over it and then sending each
        const mentorsData = requestedAmount.map(mentor => ({
            _id: mentor._id,
            id: mentor.id,
            image: getMentorImage(mentor.image),
            name: mentor.name,
            position: mentor.position,
            charge: mentor.charge,
            experiences: mentor.experiences
        }));

        res.status(200).json({mentorsData})
    } catch (err) {
        return res.status(500).send("Couldn't get mentors by amount: " + err)
    }
    // next() don't call next to prevent other controllers running alongside this one
}

async function getAllMentors(req, res, next) {
    try {
        const mentors = await Mentor.find({})
        // Make a copy of the received array to avoid sending multiple requests by looping over it and then sending each
        // We do it like this to make request and send the profile images properly
        const mentorsData = mentors.map(mentor => ({
            _id: mentor._id,
            id: mentor.id,
            image: getMentorImage(mentor.image),
            name: mentor.name,
            position: mentor.position,
            charge: mentor.charge,
            experiences: mentor.experiences
        }));
        res.status(200).json(mentorsData)
    } catch (err) {
        return res.status(500).send("Couldn't get all of the mentors: " + err)
    }
    next()
}

async function getMentorById(req, res, next) {
    try {
        const givenId = req.params.id
        // Cast to ObjectId, only if givenId can result in a valid ObjectId
        const query = isValidObjectId(givenId) ? { $or: [{ _id: givenId }, { id: givenId }] } : { id: givenId }
        const match = await Mentor.findOne(query)
        if (!match) {
            return res.status(401).send("Mentor with such an id doesn't exist.")
        }
        res.status(200).json({
            _id: match._id,
            id: match.id,
            // Access the static image, if we don't specify the route like this, the frontend won't be able to access the image
            // Unless we store it there as well and if we store it there as well, the purpose of the backend will be defeated.
            image: getMentorImage(match.image), 
            email: match.email,
            name: match.name,
            position: match.position,
            charge: match.charge,
            experiences: match.experiences,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send("Couldn't get mentor by id, " + err)
    }
    next()
}

async function addExperience(req, res, next) {
    try {
        const { id, experience } = req.body
        if (!id) {
            return res.status(401).send("Plaese provide an id.")
        }

        if (!experience) {
            return res.status(401).send("Please provide a valid experience.");
        }
        const updatedExperiences = await Mentor.findByIdAndUpdate(id, {$push: {experiences: experience}}, {new: true})
        res.status(200).json(updatedExperiences)
    } catch (err) {
        return res.status(500).send("Couldn't add the new experience, " + err)
    }
    next()
}

async function removeExperience(req, res, next) {
    try {
        const { mentorId, experienceId } = req.params
        // Use $pull to pull out (Delete an object) from the experiences array, which is a property on Mentor
        // Can't use findByIdAndDelete because it only deletes an entire document, it can't update it's properties
        const experienceToRemove = await Mentor.findByIdAndUpdate(
            mentorId, {$pull: {experiences: {_id: experienceId}}}, {new: true}
        )
        if (!experienceToRemove) {
            return res.status(404).send("Couldn't find the suggested experience")
        }
        res.status(200).json(experienceToRemove)
    } catch (err) {
        return res.status(500).send("Couldn't remove the experience, " + err)
    }
    next()
}

module.exports = {getMentorsByAmount, getAllMentors, getMentorById, addExperience, removeExperience}