const { priceWatcher } = require("./bull-cron");

const url =
  "https://www.tokopedia.com/applewatchstuff/apple-watch-series-3-gps-42mm-silver-aluminium-with-white-sport-band-full-price";

// const url =
//   "https://www.bukalapak.com/p/handphone/smartwatch/25btp6a-jual-amazfit-gtr-smartwatch-xiaomi-smart-watch-huami-international-version?content_type=fvt_prom&from=product-detail&section=reco";

priceWatcher(url);

function priceWatcher(url, id) {
  console.log("into priceWatcher");
  const watcher = new Bull(`watcher ${id}`);
  // watcher.empty();
  const jobs = [
    {
      job: `Updating ${id}`,
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
                }
                if (data.email && data.targetPrice) {
                  console.log("email && targetPrice");
                  if (result.price == data.targetPrice) {
                    const input = {
                      email: data.email,
                      url: data.url,
                      targetPrice: data.targetPrice,
                    };
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
                }
                if (data.email && data.targetPrice) {
                  console.log("email && targetPrice");
                  if (result.price == data.targetPrice) {
                    const input = {
                      email: data.email,
                      url: data.url,
                      targetPrice: data.targetPrice,
                    };
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
