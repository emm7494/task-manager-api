const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);
const msg = {
  to: "emm7494@gmail.com",
  from: "emm7494@gmail.com",
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>"
};

(async () => {
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error(err.toString());
  }
})();
