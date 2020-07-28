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
      cron: "5 * * * *",
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
                      .then(_ => {
                        console.log(
                          "Items history has been successfully updated!"
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    if (data.emailNotif && !data.targetPrice) {
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
                    } else if (data.emailNotif && data.targetPrice) {
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
                    } else if (!data.emailNotif && data.targetPrice) {
                      console.log("null email && targetPrice");
                      if (result.price <= data.targetPrice) {
                        data.pushNotif = true;
                        console.log("notif sent");
                        Item.updateById(id, data.pushNotif)
                          .then(console.log)
                          .catch(console.error)
                        queue.empty();
                      }
                    } else if (!data.emailNotif && data.priceChangeNotif) {
                      console.log("priceChangeNotif");
                      if (data.currentPrice !== result.price) {
                        data.pushNotif = true;
                        console.log("notif sent");
                        Item.updateById(id, data.pushNotif)
                          .then(console.log)
                          .catch(console.error)
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
              console.log(response)
              // console.log(`Error(${response.status}): ${response.statusText}`)
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