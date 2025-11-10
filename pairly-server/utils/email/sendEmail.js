const nodemailer = require('nodemailer');
const { Resend } = require('resend');

let sendEmail;

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

