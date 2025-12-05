const { isValidObjectId, Mongoose } = require('mongoose');
const Mentor = require('../models/mentor.model.js')
const bcrypt = require('bcrypt')
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
        // {$push: {experiences: experience}}, {new: true}
        const mentor = await Mentor.findById(id)

        if (!mentor) {
            return res.status(404).send("Mentor not found.");
        }

        // Count how many experiences are on top
        let topCounter = 0;
        for (let experience of mentor.experiences) {
            if (experience.isOnTop) {
                topCounter++
            }
        }

        // If there are 3 experiences on top already, don't allow more
        if (topCounter === 3) {
            console.log("Making the new experience's isOnTop false because there are already 3 top experience...")
            experience.isOnTop = false
            console.log(experience.isOnTop)
        }

        mentor.experiences.push(experience)
        await mentor.save()
        res.status(200).json(mentor.experiences)
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

async function updateExperiences(req, res, next) {
    try {
        const { mentorId, changes } = req.body
        if (!changes) {
            return res.status(401).send("Please provide the changes.")
        }
        const mentor = await Mentor.findById(mentorId)
        for (let experience of changes) {
            if (experience.action === 'update') {
                // .id() is a mongoose subdocument method 
                // It does the same thing as
                // mentor.experiences.find(exp => exp._id.toString() === experienceId.toString());
                const experienceToUpdate = mentor.experiences.id(experience._id)
                if (!experienceToUpdate) return res.status(404).send("The suggested experience to update was not found.")
                // Object.assign copies all enumerable values of the second parameter to the first parameter
                // It is more effective than manually updating each field of the experience         
                Object.assign(experienceToUpdate, experience.data)
            } else if (experience.action === 'remove') {
                mentor.experiences.id(experience._id)?.deleteOne()
            }           
        }
        await mentor.save()
        res.status(200).json({message: "Updated successfully."})
    } catch (error) {
        return res.status(500).send(`Couldn't update the experiences: ${error}`)
    }
    next()
}

async function updateProfileProperty(req, res, next) {
    try {
        const { mentorId, property, replacement } = req.body
        const profileImage = req.file ? req.file.path : null
        console.log(profileImage)
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).send("Mentor not found.")
        }

        if (property in mentor && property === 'image' && profileImage) {
            // The controller needs to handle updating the profile image in the database
            mentor.image = profileImage
            console.log(mentor.experiences)
            await mentor.save()

            return res.status(200).json({
                success: true,
                newImage: profileImage
            })
        }       
        
        if (property in mentor && property === 'password')  {
            const newHashedPassword = await bcrypt.hash(replacement, 10)
            mentor[property] = newHashedPassword
            await mentor.save()
            return res.status(200).json(mentor)
        }
    
        if (property in mentor) {
            mentor[property] = replacement
            await mentor.save()
            res.status(200).json(mentor)
        } else {
            return res.status(404).send("The given property was not found on the mentor.")
        }
        
    } catch (error) {
        console.log("Got an error: " + error)
        return res.status(500).send(`Couldn't update profile property: ${error}`)
    }
    next()
}

module.exports = {
    getMentorsByAmount, getAllMentors, getMentorById, addExperience, 
    removeExperience, updateExperiences, updateProfileProperty
}