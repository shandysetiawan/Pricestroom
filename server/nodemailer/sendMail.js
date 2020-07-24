const nodemailer = require('nodemailer')

// function terima parameter data bentuknya object isinya email tujuan, url barang, dan target price
// data = {email: <string alamat email tujuan>, url: <url product>, targetPrice: <target price>}
export function mailConfig(data) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "fun.event43@gmail.com",
          pass: "finalproject43",
        },
    });
    // console.log("setelah transporter")

    const mailOption = {
        from: "fun.event43@gmail.com",
        to: data.email, // email tujuan diambil dari data object parameter => data.email
        subject: `Price is set`,
        text: `The price of ${data.url} is ${data.targetPrice}, check it out!!!`, // di sini juga ada nama dan url dari parameter => data.url, data.targetPrice
    };
    // console.log("setelah mailopt")

    transporter.sendMail(mailOption, (err, data) => {
        console.log("setelah dlm mailer notice");
        if (err) {
          throw err;
        } else {
          console.log('Email Sent Successfully')
        }
    });
}
