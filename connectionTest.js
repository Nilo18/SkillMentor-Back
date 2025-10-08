const nodemailer = require('nodemailer');
require('dotenv').config()
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transport.verify()
  .then(() => console.log('SMTP connection successful'))
  .catch(err => console.error('SMTP connection failed:', err));


