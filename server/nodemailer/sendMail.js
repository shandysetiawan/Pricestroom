const nodemailer = require("nodemailer");

// function terima parameter data bentuknya object isinya email tujuan, url barang, dan target price
// data = {email: <string alamat email tujuan>, url: <url product>, targetPrice: <target price>}
// playstroom@gmail.com
// password: playstroom123
function mailNotif(data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "playstroom@gmail.com",
      pass: "playstroom123",
    },
  });
  // console.log("setelah transporter")

  const mailOption = {
    from: "playstroom@gmail.com",
    to: data.email, // email tujuan diambil dari data object parameter => data.email
    subject: `Price is set`,
    text: `The price of ${data.url} is ${data.targetPrice}, check it out!!!`, // di sini juga ada nama dan url dari parameter => data.url, data.targetPrice
  };
  // console.log("setelah mailopt")

  transporter.sendMail(mailOption, (err, data) => {
    console.log("setelah dlm mailer notif");
    if (err) {
      throw err;
    } else {
      console.log("Email Sent Successfully");
    }
  });
}

function mailWatch(data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "playstroom@gmail.com",
      pass: "playstroom123",
    },
  });
  // console.log("setelah transporter")

  const mailOption = {
    from: "playstroom@gmail.com",
    to: data.email, // email tujuan diambil dari data object parameter => data.email
    subject: `Price is set`,
    text: `The price of ${data.url} before is ${data.priceBefore}, and after is ${data.priceAfter}, check it out!!!`, // di sini juga ada nama dan url dari parameter => data.url, data.targetPrice
  };
  // console.log("setelah mailopt")

  transporter.sendMail(mailOption, (err, data) => {
    console.log("setelah dlm mailer watcher");
    if (err) {
      throw err;
    } else {
      console.log("Email Sent Successfully");
    }
  });
}

module.exports = {
  mailNotif,
  mailWatch,
};
