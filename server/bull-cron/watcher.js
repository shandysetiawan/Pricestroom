const Bull = require("bull");
const { tokopediaScraper, bukalapakScraper } = require("../scrapers");
const Item = require("../models/track");
const watchers = [];
const { mailNotif, mailWatch } = require("../nodemailer/sendMail");

function priceWatcher(url, id) {
  console.log("MASUK PRICE WATCHER");
  const watcher = new Bull(`watcher ${id}`);
  // watcher.empty();
  const jobs = [
    {
      job: "Updating",
    },
  ];
  watcher.add(jobs, {
    repeat: {
      cron: "*/20 * * * * *",
      // every: 3000
    },
  });
  if (url.search("tokopedia") !== -1) {
    watcher.process((job, done) => {
      tokopediaScraper(url)
        .then((result) => {
          console.log(result);
          if (result) {
            Item.findByUrl(url).then((data) => {
              if (data) {
                console.log(data);
                let dataHistory = data.history;
                let history = {
                  time: result.date,
                  price: result.price,
                  stock: result.stock,
                };
                let pushHistory = [...dataHistory, history];
                const editItem = {
                  currentPrice: result.price,
                  history: pushHistory,
                };
                Item.updateMany(data.url, editItem)
                  .then((data1) => {
                    console.log("Items history has been successfully updated!");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                if (data.email && !data.targetPrice) {
                  console.log("MASUK EMAIL && NULL TARGET PRICE");
                  if (data.currentPrice !== result.price) {
                    const input = {
                      email: data.email,
                      url: data.url,
                      priceBefore: data.currentPrice,
                      priceAfter: result.price,
                    };
                    console.log("MASUK MAIL WATCH");
                    mailWatch(input);
                  }
                }
                if (data.email && data.targetPrice) {
                  console.log("MASUK EMAIL && TARGET PRICE");
                  if (result.price == data.targetPrice) {
                    const input = {
                      email: data.email,
                      url: data.url,
                      targetPrice: data.targetPrice,
                    };
                    console.log("MASUK MAIL NOTIF");
                    mailNotif(input);
                  }
                }
              } else {
                throw {
                  code: 404,
                  message: "Sorry, data is not found",
                };
              }
            });
          } else {
            throw {
              code: 404,
              message: "Sorry, result is not found",
            };
          }
        })
        .catch(({ response }) =>
          console.log(`Error(${response.status}): ${response.statusText}`)
        );
      done(null, `${job.data}`);
    });
  } else if (url.search("bukalapak") !== -1) {
    watcher.process((job, done) => {
      bukalapakScraper(url)
        .then((result) => {
          console.log(result);
          if (result) {
            Item.findByUrl(url).then((data) => {
              if (data) {
                console.log(data);
                let dataHistory = data.history;
                let history = {
                  time: result.date,
                  price: result.price,
                  stock: result.stock,
                };
                let pushHistory = [...dataHistory, history];
                const editItem = {
                  currentPrice: result.price,
                  history: pushHistory,
                };
                Item.updateMany(data.url, editItem)
                  .then((data1) => {
                    console.log("Items history has been successfully updated!");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                if (data.email && !data.targetPrice) {
                  console.log("MASUK EMAIL && NULL TARGET PRICE");
                  if (data.currentPrice !== result.price) {
                    const input = {
                      email: data.email,
                      url: data.url,
                      priceBefore: data.currentPrice,
                      priceAfter: result.price,
                    };
                    console.log("MASUK MAIL WATCH");
                    mailWatch(input);
                  }
                }
                if (data.email && data.targetPrice) {
                  console.log("MASUK EMAIL && TARGET PRICE");
                  if (result.price == data.targetPrice) {
                    const input = {
                      email: data.email,
                      url: data.url,
                      targetPrice: data.targetPrice,
                    };
                    console.log("MASUK MAIL NOTIF");
                    mailNotif(input);
                  }
                }
              } else {
                throw {
                  code: 404,
                  message: "Sorry, data is not found",
                };
              }
            });
          } else {
            throw {
              code: 404,
              message: "Sorry, result is not found",
            };
          }
        })
        .catch(({ response }) =>
          console.log(`Error(${response.status}): ${response.statusText}`)
        );
      done(null, `${job.data}`);
    });
  }
  watchers = [...watchers, watcher];
  // console.log(watchers);
}
module.exports = {
  priceWatcher,
};

// from cheerio
// {
//   name: 'Apple Watch Series 3 GPS 42mm Silver Aluminium with White Sport Band - FULL PRICE',
//   price: 3699000,
//   store: 'applewatchstuff',
//   stock: 'Stok tersisa <10',
//   date: 2020-07-24T14:41:52.245Z
// }

// from POST
//   "data": {
//     "url": "https://www.tokopedia.com/applewatchstuff/apple-watch-series-3-gps-42mm-silver-aluminium-with-white-sport-band-full-price",
//     "imageUrl": "test1",
//     "storeName": "test1",
//     "initialPrice": 9000,
//     "currentPrice": 9000,
//     "history": [
//       {
//         "time": "2020-07-25T09:11:48.859Z",
//         "price": 9000,
//         "stock": "18"
//       }
//     ],
//     "targetPrice": null,
//     "email": null,
//     "createdAt": "2020-07-25T09:11:48.859Z",
//     "_id": "5f1bf75403b7491f90bea26d"
//   },
//   "message": {
//     "message": "Item has been successfully tracked!"
//   }
// }

// skenario 1 : -target ada, email ada, cek harga dr scrapper sm target price-> kalo sama kirim email, kalo ga sama ga ngapa2in
// skenario 2: -target gada, email ada, cek info terakhir mengenai data terakhir scrapper dengan data terakhir history,
// kalau ada perubahan, kirim info up and down
// skenario 3: email gada, ga ngapa2inau ga ada target price dan email, maka kirim notifikasi popup

// Item.findById(id)
//     .then((data) => {

//         let dataHistory = data.history
//         let history = { time: ().time, price: ().price, stock: ().stock }
//         let pushHistory = [...dataHistory, history]

//         const editItem = {
//             current_price: ()price,
//             history: pushHistory,
//         }

//         Item.updateById(id, editItem)

//     })
//     .then((data) => {

//     })
//     .catch((err) => {

//     })
