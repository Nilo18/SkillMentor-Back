const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    // cb is a callback that will tell multer what to do next
    destination: (req, file, cb) => {
        // null as the first argument means no error, we could also pass Error as the first argument and null as the second
        // This will mean that there's an error
        cb(null, 'assets/profile-imgs')
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        console.log('Date.now() is: ', Date.now())
        console.log('The result of username + now() + extension: ', 'mentor' + Date.now() + extension)

        // Chain username, date and extension to create a unique file name
        const cbReturn = cb(null, 'mentor' + Date.now() + extension)
    }
})

// Create the storage instance 
// upload now knows where to put the files and how to name them
const upload = multer({storage})

module.exports = upload