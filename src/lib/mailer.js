const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'c308a9c20b32a5',
    pass: '014ff0ebdac4d6'
  }
})
