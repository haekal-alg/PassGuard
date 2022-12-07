const nodemailer = require("nodemailer");
const config = require("./../config");

function getTransporter() {
  // if (process.env.NODE_ENV === 'production') {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD,
    },
  });
  //}

  // return nodemailer.createTransport({
  // 	host: config.EMAIL_HOST,
  // 	port: config.EMAIL_PORT,
  // 	auth: {
  // 		user: config.EMAIL_USERNAME,
  // 		pass: config.EMAIL_PASSWORD
  // 	}
  // });
}

const sendEmail = async (options) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: "PassGuard",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  //console.log(`sending email to ${options.email}`)
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
