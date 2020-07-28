const Bull = require("bull");
const { scrapper } = require("../scrapers");
const Item = require("../models/track");
let watchers = [];
const { mailNotif, mailWatch } = require("../nodemailer/sendMail");

function priceWatcher(url, id) {
  // console.log("into priceWatcher");
  const watcher = new Bull(`watcher ${id}`);
  watchers = [...watchers, watcher];
  let queue = watchers[watchers.length - 1];
  const jobs = [
    {
      job: `Updating ${id}`,
    },
  ];
  queue.add(jobs, {
    repeat: {
      cron: "30 * * * * *",
      // every: 20000
    },
  });
  queue.process((job, done) => {
    Item.findById(id)
      .then((found) => {
        if (found) {
          scrapper(url)
            .then((result) => {
              console.log("scrapping success");
              if (result) {
                Item.findByUrl(url).then((data) => {
                  if (data) {
                    let dataHistory = data.history;
                    let history = {
                      time: result.date,
                      price: result.price,
                      stock: result.stock,
                    };
                    let pushHistory = [...dataHistory, history];
                    console.log(
                      data.url,
                      "targetPrice: " + data.targetPrice,
                      pushHistory
                    );
                    const editItem = {
                      currentPrice: result.price,
                      history: pushHistory,
                    };
                    Item.updateMany(data.url, editItem)
                      .then((data1) => {
                        console.log(
                          "Items history has been successfully updated!"
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    if (data.email && !data.targetPrice) {
                      console.log("email && null targetPrice");
                      if (data.currentPrice !== result.price) {
                        const input = {
                          email: data.email,
                          url: data.url,
                          priceBefore: data.currentPrice,
                          priceAfter: result.price,
                        };
                        mailWatch(input);
                      }
                    } else if (data.email && data.targetPrice) {
                      console.log("email && targetPrice");
                      if (result.price <= data.targetPrice) {
                        const input = {
                          email: data.email,
                          url: data.url,
                          price: result.price,
                        };
                        mailNotif(input);
                        queue.empty();
                      }
                    } else if (data.pushNotif && data.targetPrice) {
                      console.log("pushNotif && targetPrice");
                      if (result.price <= data.targetPrice) {
                        data.emailNotif = true;
                        console.log("notif sent");
                        queue.empty();
                      }
                    } else if (data.pushNotif && data.priceChangeNotif) {
                      console.log("priceChangeNotif");
                      if (data.currentPrice !== result.price) {
                        data.emailNotif = true;
                        console.log("notif sent");
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
        } else {
          queue.empty();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    done(null, `${job.data}`);
  });
}
module.exports = {
  priceWatcher,
};

// watchers
// [
//   Queue {
//     name: 'watcher 5f1eb3eaf12f943738f2ad72',
//     token: 'a51e7c38-f528-4ab6-894a-a592a0e29292',
//     keyPrefix: 'bull',
//     clients: [ [Redis] ],
//     clientInitialized: true,
//     _events: [Object: null prototype] { close: [Function], error: [Function] },
//     _eventsCount: 2,
//     _initializing: Promise { <pending> },
//     handlers: {},
//     processing: [],
//     retrieving: 0,
//     drained: true,
//     settings: {
//       lockDuration: 30000,
//       stalledInterval: 30000,
//       maxStalledCount: 1,
//       guardInterval: 5000,
//       retryProcessDelay: 5000,
//       drainDelay: 5,
//       backoffStrategies: {},
//       lockRenewTime: 15000
//     },
//     timers: TimerManager { idle: true, listeners: [], timers: {} },
//     moveUnlockedJobsToWait: [Function: bound ],
//     processJob: [Function: bound ],
//     getJobFromId: [Function: bound ],
//     keys: {
//       '': 'bull:watcher 5f1eb3eaf12f943738f2ad72:',
//       active: 'bull:watcher 5f1eb3eaf12f943738f2ad72:active',
//       wait: 'bull:watcher 5f1eb3eaf12f943738f2ad72:wait',
//       waiting: 'bull:watcher 5f1eb3eaf12f943738f2ad72:waiting',
//       paused: 'bull:watcher 5f1eb3eaf12f943738f2ad72:paused',
//       resumed: 'bull:watcher 5f1eb3eaf12f943738f2ad72:resumed',
//       'meta-paused': 'bull:watcher 5f1eb3eaf12f943738f2ad72:meta-paused',
//       id: 'bull:watcher 5f1eb3eaf12f943738f2ad72:id',
//       delayed: 'bull:watcher 5f1eb3eaf12f943738f2ad72:delayed',
//       priority: 'bull:watcher 5f1eb3eaf12f943738f2ad72:priority',
//       'stalled-check': 'bull:watcher 5f1eb3eaf12f943738f2ad72:stalled-check',
//       completed: 'bull:watcher 5f1eb3eaf12f943738f2ad72:completed',
//       failed: 'bull:watcher 5f1eb3eaf12f943738f2ad72:failed',
//       stalled: 'bull:watcher 5f1eb3eaf12f943738f2ad72:stalled',
//       repeat: 'bull:watcher 5f1eb3eaf12f943738f2ad72:repeat',
//       limiter: 'bull:watcher 5f1eb3eaf12f943738f2ad72:limiter',
//       drained: 'bull:watcher 5f1eb3eaf12f943738f2ad72:drained',
//       progress: 'bull:watcher 5f1eb3eaf12f943738f2ad72:progress'
//     }
//   }
// ]

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
