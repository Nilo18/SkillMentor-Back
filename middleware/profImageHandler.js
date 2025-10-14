const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
const cloudinary = require('cloudinary').v2; // ✅ proper import
// require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use Cloudinary storage instead of local disk
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mentors',                // your folder name in Cloudinary
    allowed_formats: ['jpg', 'png'],  // optional
    public_id: (req, file) => 'mentor' + Date.now(),  // same naming logic you used before
  },
});

// Create the storage instance 
// upload now knows where to put the files and how to name them
const upload = multer({storage})

module.exports = upload