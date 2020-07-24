const axios = require("axios")
const cheerio = require("cheerio")

function tokopediaScraper (url) {
    const tokopedia = url.replace(/m.tokopedia/g, 'www.tokopedia')
    return axios.get(tokopedia)
        .then((resp) => {
            const html = resp.data
            const $ = cheerio.load(html)
            const priceClassElement = "DetailProductPrice"
            const nameClassElement = "DetailProductName"
            const stockClassElement = "DetailProductStock"
            const storeClassElement = "FooterShopName"

            const price = $(`h3[data-testid*="${priceClassElement}"]`).text()
            const name = $(`h1[data-testid*="${nameClassElement}"]`).text()
            const stock = $(`p[data-testid*="${stockClassElement}"]`).text()
            const store = $(`a[data-testid*="${storeClassElement}"]`).text()
            const data = {
                name,
                price: Number(price.match(/\d+/g).join("")),
                store,
                stock: stock.split(",")[0],
                date: new Date()
            }
            return data
        })
}

// Testing
// const url = "https://m.tokopedia.com/applewatchstuff/apple-watch-series-3-gps-42mm-silver-aluminium-with-white-sport-band-full-price"

// tokopediaScraper(url)
//     .then(data => console.log(data))
//     .catch(({response}) => console.log(`Error(${response.status}): ${response.statusText}`))

module.exports = tokopediaScraper