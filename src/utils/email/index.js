const nodemailer = require('nodemailer');
const serverConfig = require('../../config');
const handlebars = require('handlebars');
const fs = require('fs/promises');

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

async function renderTemplate(templatePath, data) {
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateSource);
    return compiledTemplate(data);
  }

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
