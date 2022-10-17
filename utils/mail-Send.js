const nodemailer = require("nodemailer");

const USER_EMAIL = "anddeveloper.abdulbasit@gmail.com";
const EMAIL_KEY = "keqnjuofdiixkgad";

module.exports = (mailTo, mailSubject, text) => {
  const message = {
    from: USER_EMAIL,
    to: mailTo,
    subject: mailSubject,
    text: text,
  };
  nodemailer
    .createTransport({
      service: "gmail",
      auth: {
        user: USER_EMAIL,
        pass: EMAIL_KEY,
      },
      port: 465,
      host: "smtp.gmail.com",
    })
    .sendMail(message, (err) => {
      if (err) console.log("err,err");
      else console.log("email send");
    });
};
