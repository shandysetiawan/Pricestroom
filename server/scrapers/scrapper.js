const axios = require("axios");
const cheerio = require("cheerio");

function scrapper(url) {
  // console.log("into scrapper");
  if (url.search("tokopedia") !== -1) {
    const tokopedia = url.replace(/m.tokopedia/g, "www.tokopedia");
    // console.log('line 8', axios)
    return axios
      .get(tokopedia)
      .then((resp) => {
        const html = resp.data;

        const $ = cheerio.load(html);
        const priceClassElement = "DetailProductPrice";
        const nameClassElement = "DetailProductName";
        const stockClassElement = "DetailProductStock";
        const storeClassElement = "FooterShopName";
        // console.log('line 17', html)
        const price = $(`h3[data-testid*="${priceClassElement}"]`).text();
        const name = $(`h1[data-testid*="${nameClassElement}"]`).text();
        const stock = $(`p[data-testid*="${stockClassElement}"]`).text();
        const store = $(`a[data-testid*="${storeClassElement}"]`).text();
        const data = {
          name,
          price: Number(price.match(/\d+/g).join("")),
          store,
          stock: stock.split(",")[0],
          date: new Date(),
        };
        return data;
      })
      .catch((err) => {
        // console.log(err);
        return err
      });
  } else if (url.search("bukalapak") !== -1) {
    const bukalapak = url.replace(/www.bukalapak/g, "m.bukalapak");
    return axios
      .get(bukalapak, {
        headers: { "User-Agent": "Mozilla/5.0" },
      })
      .then((resp) => {
        // console.log('>>>>', resp)
        const html = resp.data;
        const $ = cheerio.load(html);

        const stock = $(`div.qa-pd-stock`).text();

        let priceElement = 'script[type="application/ld+json"]';
        let siteDataStr = $(`${priceElement}`)[1].children[0].data;
        let siteData = JSON.parse(siteDataStr);
        // console.log(siteData)

        const name = siteData.name;
        const price = siteData.offers.lowPrice;
        const store = siteData.offers.seller.name;

        const data = {
          name,
          price,
          store,
          stock: stock.match(/\d/g).join(""),
          date: new Date(),
        };
        return data;
      })
      .catch(console.log); //Catch dihandle saat penggunaan bukalapakScraper
  } else {
    return {
      code: "404",
      message: "url not found",
    };
  }
}

module.exports = scrapper;
