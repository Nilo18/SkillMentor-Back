const express = require('express')
const signupRouter = express.Router()
const signupUser = require("../controllers/signupController.js")
const upload = require('../middleware/profImageHandler.js')

// upload.single('profileImage') tells multer to expect one file upload from the form field name profileImage
// It is multer middleware
signupRouter.post('/', upload.single('image'), signupUser)

module.exports = signupRouter