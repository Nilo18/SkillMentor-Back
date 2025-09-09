const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const mentorsRouter = require('./routes/mentorsRouter.js')

app.use(cors({origin: 'http://localhost:4200'}))
app.use(express.json())
// Serve static assets folder on to access images and icons
// Documents in the database should only have the image names because otherwise they would mess up the path, 
// the path expects to serve the static assets folder on /mentors, /assets itself is not a route
app.get('/', (req, res, next) => {
    res.status(200).send("Backend is running.")
})
app.use('/mentors', express.static('assets/profile-imgs')) 
app.use('/mentors', mentorsRouter)

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to the db')
        app.listen(5000, () => {
            console.log(`App is listening on port ${port}`)
        })
    } catch (err) {
        console.log('Failed to connect to the database: ', err)
    }
}

start()