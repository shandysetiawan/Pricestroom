const axios = require("axios")
const cheerio = require("cheerio")

function bukalapakScraper (url) {
    const bukalapak = url.replace(/www/g, 'm')
    return axios.get(
        bukalapak, 
        {
            headers: { "User-Agent": "Mozilla/5.0" },
        }
    )
        .then((resp) => {
            const html = resp.data
            const $ = cheerio.load(html)

            const stock = $(`div.qa-pd-stock`).text()

            let priceElement = 'script[type="application/ld+json"]';
            let siteDataStr = $(`${priceElement}`)[1].children[0].data;
            let siteData = JSON.parse(siteDataStr);
            // console.log(siteData)

            const name = siteData.name
            const price = siteData.offers.lowPrice
            const store = siteData.offers.seller.name

            const data = {
                name,
                price,
                store,
                stock: stock.match(/\d/g).join(""),
                date: new Date()
            }
            return data
        })
        // .catch(console.log) //Catch dihandle saat penggunaan bukalapakScraper
}

//Test
// const url = "https://www.bukalapak.com/p/handphone/smartwatch/25btp6a-jual-amazfit-gtr-smartwatch-xiaomi-smart-watch-huami-international-version?content_type=fvt_prom&from=product-detail&section=reco"
// bukalapakScraper(url)
//     .then(console.log)
//     .catch(console.log)

module.exports = bukalapakScraper