const express = require('express')
const signinRouter = express.Router()
const signinUser = require('../controllers/signinController.js')

signinRouter.post('/', signinUser)

module.exports = signinRouter