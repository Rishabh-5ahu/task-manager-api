const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)
sgMail.send({
    to: 'rishabhsahu66@gmail.com',
    from: 'rishabhsahu66@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js'
  },(err, success) => {
    if (err) {
      console.log(err)
    }
})