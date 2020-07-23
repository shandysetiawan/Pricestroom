const axios = require("axios");
const cheerio = require("cheerio");

function tokopediaScraper (url) {
    return axios.get(url)
        .then((resp) => {
            const html = resp.data;
            const $ = cheerio.load(html);
            const priceClassElement = "DetailProductPrice";
            const nameClassElement = "DetailProductName";
            const stockClassElement = "DetailProductStock";
            const storeNameClassElement = "FooterShopName";

            const price = $(`h3[data-testid*="${priceClassElement}"]`).text();
            const name = $(`h1[data-testid*="${nameClassElement}"]`).text()
            const stock = $(`p[data-testid*="${stockClassElement}"]`).text()
            const storeName = $(`a[data-testid*="${storeNameClassElement}"]`).text()
            const data = {
                name,
                price: Number((price.split("Rp")[1]).split(".").join("")),
                storeName,
                stock,
                date: new Date()
            }
            return data
        })
}

// Testing
// const url = "https://www.tokopedia.com/applewatchstuff/apple-watch-series-3-gps-42mm-silver-aluminium-with-white-sport-band-full-price"

// tokopediaScraper(url)
//     .then(data => console.log(data))
//     .catch(({response}) => console.log(`Error(${response.status}): ${response.statusText}`))

module.exports = tokopediaScraper