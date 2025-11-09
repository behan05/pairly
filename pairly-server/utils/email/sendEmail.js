const nodemailer = require('nodemailer');
const { Resend } = require('resend');
require('dotenv').config(); // ensure env variables are loaded

let sendEmail;

console.log('📌 NODE_ENV:', process.env.NODE_ENV);
console.log('📌 EMAIL_USER:', process.env.EMAIL_USER);
console.log('📌 RESEND_API_KEY:', !!process.env.RESEND_API_KEY); // just true/false for security

if (process.env.NODE_ENV !== 'production') {
  // Local: Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASS,
    },
  });

  sendEmail = async (to, subject, { text, html }) => {
    console.log('📧 Sending email via Gmail...');
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
  };
} else {
  // Production: Resend HTTPS API
  const resend = new Resend(process.env.RESEND_API_KEY);

  sendEmail = async (to, subject, { text, html }) => {
    console.log('📧 Sending email via Resend...');
    console.log('From address:', process.env.EMAIL_USER);
    await resend.emails.send({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
  };
}

module.exports = sendEmail;

