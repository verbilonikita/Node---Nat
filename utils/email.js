const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    //Activate in gmail "less secure app" or do not use gmail
    //For testing use mailtrap - as above
  });

  // 2. Define the email options
  const mailOptions = {
    from: "Nikita <blabla@mail.ru",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3. Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
