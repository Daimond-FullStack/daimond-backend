const nodemailer = require('nodemailer');
const serverConfig = require('../../config');
const { renderTemplate } = require('../helper');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: serverConfig.NODEMAILER.EMAIL,
        pass: serverConfig.NODEMAILER.PASSWORD
    },
});

exports.sendEmail = async (options) => {
    return new Promise(async (resolve, reject) => {

        const html = await renderTemplate(options.templatePath, options.templateData);

        const mailOptions = {
            from: options.from,
            to: options.to,
            replyTo: options.from ?? serverConfig.NODEMAILER.EMAIL,
            subject: options.subject,
            html,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('🚨 Error sending email:', error);
                reject(error);
            } else {
                console.log('🚀 Email sent:', info.response);
                resolve();
            }
        });
    });
}
