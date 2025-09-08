const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const mentorsRouter = require('./routes/mentorsRouter.js')

app.use(cors({origin: 'http://localhost:4200'}))
app.use(express.json())
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