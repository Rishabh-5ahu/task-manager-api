const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)
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