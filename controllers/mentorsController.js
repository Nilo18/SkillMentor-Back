const Mentor = require('../models/mentor.model.js')

async function getMentorsByAmount(req, res, next) {
    try {
        const { amount } = req.body
        const requestedAmount = await Mentor.find().limit(amount)
        res.status(200).json(requestedAmount)
    } catch (err) {
        res.status(500).send("Couldn't get mentors by amount.")
    }
    next()
}

module.exports = {getMentorsByAmount}