const nodemailer = require("nodemailer");

// function terima parameter data bentuknya object isinya email tujuan, url barang, dan target price
// data = {email: <string alamat email tujuan>, url: <url product>, targetPrice: <target price>}

let { EMAILPS, EMAILPASSWORD } = process.env;

const auth = {
  user: EMAILPS,
  pass: EMAILPASSWORD
};

function mailNotif(data) {
  // console.log("into mailNotif");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth,
  });
  // console.log("setelah transporter")

  const mailOption = {
    from: EMAILPS,
    to: data.email, // email tujuan diambil dari data object parameter => data.email
    subject: `Price is set`,
    text: `The price of ${data.url} is ${data.price}, check it out!!!`, // di sini juga ada nama dan url dari parameter => data.url, data.targetPrice
  };
  // console.log("setelah mailopt")

  transporter.sendMail(mailOption, handleSendEmail)

}
function handleSendEmail(err, data) {
  // console.log("into sendMail");
  if (err) {
    throw err;
  } else {
    // console.log("Email Sent Successfully");
    return true
  }
}

function mailWatch(data) {
  // console.log("into mailWatch");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth
  });
  // console.log("setelah transporter")

  const mailOption = {
    from: EMAILPS,
    to: data.email, // email tujuan diambil dari data object parameter => data.email
    subject: `Price is set`,
    text: `The price of ${data.url} before is ${data.priceBefore}, and after is ${data.priceAfter}, check it out!!!`, // di sini juga ada nama dan url dari parameter => data.url, data.targetPrice
  };
  // console.log("setelah mailopt")

  transporter.sendMail(mailOption, handleSendEmail)
}

module.exports = {
  mailNotif,
  mailWatch,
  handleSendEmail
};
