const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // Create transporter.
    const mailtransporter = nodemailer.createTransport({
        service : process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Email options.
    const mailOptions = {
        from: "Vite&GourmandTeam@gmail.com",
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // Send email.
    await mailtransporter.sendMail(mailOptions);
}

module.exports = sendEmail;