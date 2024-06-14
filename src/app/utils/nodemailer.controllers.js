const transport = require("./nodemailer.transporter");

const sendEmail = (_subject, _to, title, fee) => {
  return new Promise((resolve, reject) => {
    try {
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: _to,
        subject: _subject,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Dear Valued Customer,</h2>
        <p>Thank you for your recent purchase. We're excited to confirm that your transaction has been successfully processed. Here are the details of your purchase:</p>
        <ul>
          <li><strong>Course:</strong> ${title}</li>
          <li><strong>Fee:</strong> ${fee}</li>
        </ul>
        <p>Your course is now available for access. To get started, simply log in to your account using your registered email.</p>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Thank you for choosing our platform for your learning journey!</p>
        <p>Best regards,<br>The Learning Hero</p>
      </div>
    `,
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error while sending email:", error);
          reject({ error });
        } else {
          console.log("Email sent successfully:", info.response);
          resolve({ info });
        }
      });
    } catch (error) {
      console.error("Error while rendering the EJS template:", error);
      reject({ error });
    }
  });
};

module.exports = {
  sendEmail,
};
