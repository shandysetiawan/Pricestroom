const Bull = require("bull");
const { tokopediaScraper, bukalapakScraper } = require("../scrapers");

function watcherTokopedia(url) {
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

  watcher.process((job, done) => {
    tokopediaScraper(url)
      .then((data) => console.log(data))
      .catch(({ response }) =>
        console.log(`Error(${response.status}): ${response.statusText}`)
      );
    done(null, `${job.data}`);
  });
}

function watcherBukalapak(url) {
  const watcher1 = new Bull("watcher1");
  watcher1.empty();

  const jobs = [
    {
      job: "Updating",
    },
  ];

  watcher1.add(jobs, {
    repeat: {
      cron: "*/12 * * * * *",
      // every: 3000
    },
  });

  watcher1.process((job, done) => {
    bukalapakScraper(url)
      .then((data) => console.log(data))
      .catch(({ response }) =>
        console.log(`Error(${response.status}): ${response.statusText}`)
      );
    done(null, `${job.data}`);
  });
}

module.exports = {
  watcherTokopedia,
  watcherBukalapak,
};
