const { watcherBukalapak, watcherTokopedia } = require("./bull-cron");

const url =
  "https://www.tokopedia.com/applewatchstuff/apple-watch-series-3-gps-42mm-silver-aluminium-with-white-sport-band-full-price";

watcherTokopedia(url);

const url1 =
  "https://www.bukalapak.com/p/handphone/smartwatch/25btp6a-jual-amazfit-gtr-smartwatch-xiaomi-smart-watch-huami-international-version?content_type=fvt_prom&from=product-detail&section=reco";

watcherBukalapak(url1);

// disini manggil database, misahin antara url bukalapak sama tokopedia