const axios = require('axios');
const cheerio = require("cheerio");
const scrapper = require('../scrapers/scrapper');



jest.mock('axios')
jest.mock('cheerio')
describe('scrapping item', () => {
    test('success scrap tokopedia', async (done) => {
        let url = "https://www.tokopedia.com/headtotwo/garage-sale-preloved-cocolatte-carseat-omniguard"
        const data = {
            price: 1000,
            name: 'Kacang',
            store: 'TokoKacang',
            stock: 'Ada deh'
        }

        const mockScrapper = jest
            .fn()
            .mockImplementationOnce(cb => cb(null, data));

        mockScrapper((_, val) => console.log(val));

        const result = await axios.get.mockResolvedValue(data);
        // .toHaveProperty('store', expect.any(String))
        await expect(scrapper(url))
        console.log('data Tokopedia', result)
        done()
    });
    test('success scrap bukalapak', async (done) => {
        let url = "https://www.bukalapak.com/p/fashion-wanita/bolero-cardigan/3ke1vgn-jual-set-blouse-and-pants-light-color"

        const data = { store: "toko BL", price: 55, name: "tokok", stock: "<5", date: "2020-07-28T10:01:49.393Z" }
        axios.get.mockImplementationOnce(() => Promise.resolve(data))
        // const cheer = cheerio.load())
        // console.log('|||||||', data)
        console.log('>>>>>>', await cheer)
        await expect(scrapper(url)).resolves.toHaveProperty(data);

        // await expect(funct).toHaveProperty('store', expect.any(String))
        done()
    });
    // test('error scrapping', (done) => {

    //     done()
    // });

})
