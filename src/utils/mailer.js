const nodemailer = require('nodemailer');

const sendNewServiceRequestEmail = async (request) => {
  const emailEnabled = process.env.EMAIL_ENABLED === 'true';

  if (!emailEnabled) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New service request received',
    html: `
      <h3>New service request</h3>
      <p><strong>Name:</strong> ${request.name}</p>
      <p><strong>Email:</strong> ${request.email}</p>
      <p><strong>Service type:</strong> ${request.serviceType}</p>
      <p><strong>Budget:</strong> ${request.budgetRange || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${request.message}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendNewServiceRequestEmail
};
