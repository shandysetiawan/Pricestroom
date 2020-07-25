const Bull = require("bull");
const { tokopediaScraper, bukalapakScraper } = require("../scrapers");
const Item = require("../models/track");

function priceWatcher(url) {
  const watcher = new Bull("watcher");
  watcher.empty();
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
                  current_price: result.price,
                  history: pushHistory,
                };
                Item.updateMany(data.url, editItem)
                  .then((data1) => {
                    console.log("Items history has been successfully updated!");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                throw err;
              }
            });
          } else {
            throw err;
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
                  current_price: result.price,
                  history: pushHistory,
                };
                Item.updateMany(data.url, editItem)
                  .then((data1) => {
                    console.log("Items history has been successfully updated!");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                throw err;
              }
            });
          } else {
            throw err;
          }
        })
        .catch(({ response }) =>
          console.log(`Error(${response.status}): ${response.statusText}`)
        );
      done(null, `${job.data}`);
    });
  }
}
module.exports = {
  priceWatcher,
};

// {
//   name: 'Apple Watch Series 3 GPS 42mm Silver Aluminium with White Sport Band - FULL PRICE',
//   price: 3699000,
//   store: 'applewatchstuff',
//   stock: 'Stok tersisa <10',
//   date: 2020-07-24T14:41:52.245Z
// }

// manggil database, compare data dari database sama yg baru didapat.
// dicompare kalau datanya sama, gak ngapa2in.
// kalau datanya beda update history, jika ada target price dan ada email, compare dengan harga yg baru didapat, jika sama lalu kirim email.
// kalau ga ada target price dan email, maka kirim notifikasi popup

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
