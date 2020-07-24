const Bull = require("bull");
const { tokopediaScraper, bukalapakScraper } = require("../scrapers");

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
      cron: "*/10 * * * * *",
      // every: 3000
    },
  });
  if (url.search("tokopedia") !== -1) {
    watcher.process((job, done) => {
      tokopediaScraper(url)
        .then((data) => console.log(data))
        .catch(({ response }) =>
          console.log(`Error(${response.status}): ${response.statusText}`)
        );
      done(null, `${job.data}`);
    });
  } else if (url.search("bukalapak") !== -1) {
    watcher.process((job, done) => {
      bukalapakScraper(url)
        .then((data) => console.log(data))
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
