// This router will be used to authenticate emails
const express = require('express')
const verRouter = express.Router()
const verifyEmail = require('../controllers/verController.js')

verRouter.get('/:token', verifyEmail)

module.exports = verRouter