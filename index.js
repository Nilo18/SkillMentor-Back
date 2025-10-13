const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config() // Read .env values
const mentorsRouter = require('./routes/mentorsRouter.js')
const sliderRoute =  require('./routes/sliderRoute.js')
const signupRouter = require('./routes/signupRouter.js')
const verRouter = require('./routes/verRouter.js')
const pingRouter = require('./routes/pingRouter.js')

// console.log('MONGO_URI', process.env.MONGO_URI)
// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '****' : 'missing');

app.use(cors({origin: 'http://localhost:4200'}))
app.use(express.json())
app.use('/signup', signupRouter)
// Serve static assets folder on to access images and icons
// Documents in the database should only have the image names because otherwise they would mess up the path, 
// the path expects to serve the static assets folder on /mentors, /assets itself is not a route
app.get('/', (req, res, next) => {
    res.status(200).send("Backend is running.")
})
app.use('/slider', express.static(path.join(__dirname, 'assets/slides'), {
    maxAge: '7d',
    immutable: true // Browser can safely cache forever if unchanged
}))
app.use('/slider', sliderRoute)
app.use('/ping', pingRouter)
app.use('/verify-email', verRouter)
app.use('/mentors', express.static('assets/profile-imgs')) 
app.use('/mentors', mentorsRouter)

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to the db')
        app.listen(port, () => {
            console.log(`App is listening on port ${port}`)
        })
    } catch (err) {
        console.log('Failed to connect to the database: ', err)
    }
}

start()

// index.js
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');

// // Catch top-level errors
// process.on('uncaughtException', err => {
//   console.error('Uncaught Exception:', err);
// });
// process.on('unhandledRejection', err => {
//   console.error('Unhandled Rejection:', err);
// });

// // Use environment port or fallback
// const port = process.env.PORT || 5000;

// // Optional: MongoDB connection test
// // Uncomment if you want to test MongoDB

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Simple test route
// app.get('/', (req, res) => {
//   res.status(200).send('Backend is running on Heroku!');
// });

// // Start server
// app.listen(port, () => {
//   console.log(`App is listening on port ${port}`);
// });
