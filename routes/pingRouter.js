const express = require('express')
const pingRouter = express.Router()
const ping = require('../controllers/pingController.js')

pingRouter.get('/', ping)

module.exports = pingRouter