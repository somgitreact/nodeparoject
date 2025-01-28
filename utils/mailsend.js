const nodemailer = require('nodemailer')

const mailSend = async (option)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.MAILHOST,
        port: process.env.MAILPORT,
       // secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAILUSER,
          pass: process.env.MAILPASS,
        },
      });

      const mailOption =   {
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: option.to,
    subject: option.sub,
    text: option.message, // plain text body
   // html: "<b>Hello world?</b>", // html body

      }

      await transporter.sendMail(mailOption)

}

module.exports = mailSend