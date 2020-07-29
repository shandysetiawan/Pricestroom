const axios = require('axios');
const scrapper = require('../scrapers/scrapper');
const fs = require('fs')
const path = require("path");
const fileTokPed = fs.readFileSync(path.resolve(__dirname, './mock/carseat.html'), 'utf-8');
const fileBukaLapak = fs.readFileSync(path.resolve(__dirname, './mock/bajuBL.html'), 'utf-8');
// const fileBL = require('./mock/baju')
jest.mock('axios')
// jest.mock('cheerio')
describe('scrapping item', () => {
    test('success scrap tokopedia', async (done) => {
        let url = "https://www.tokopedia.com/headtotwo/garage-sale-preloved-cocolatte-carseat-omniguard"

        axios.get.mockImplementationOnce(() => Promise.resolve({ data: fileTokPed }))
        let response = await scrapper(url)

        await expect(response).toHaveProperty('name', 'GARAGE SALE : PRELOVED COCOLATTE CARSEAT\n              OMNIGUARD')
        await expect(response).toHaveProperty('price', 500000)
        await expect(response).toHaveProperty('stock', 'Stok terakhir')
        done()
    });
    test('success scrap bukalapak', async (done) => {
        let url = "https://m.bukalapak.com/p/handphone/power-bank/2mzqxl1-jual-power-bank-quick-charge-2-port-20000mah-with-led-flash"


        axios.get.mockImplementationOnce(() => Promise.resolve({ data: fileBukaLapak }))

        let response = await scrapper(url)
        // console.log('line29', response)
        await expect(response).toHaveProperty('name', 'Power Bank Quick Charge 2 Port 20000mAh with LED Flash')
        await expect(response).toHaveProperty('store', 'towajo')
        await expect(response).toHaveProperty('stock', '1000')
        done()
    });
    test('error scrap', async (done) => {
        let url = "https://www.tokopedia/kcjckcn"

        axios.get.mockImplementationOnce(() => Promise.resolve({ data: '<h2>smkmc</h2>' }))
        let response = await scrapper(url)
        await expect(response).not.toEqual('data')
        done()
    });
    test('scrap invalid url', async (done) => {
        let url = "https://m.bukalap.com/snaknacn"

        axios.get.mockImplementationOnce(() => Promise.resolve({ data: '<h2>smkmc</h2>' }))
        let response = await scrapper(url)
        await expect(response).toHaveProperty('code', '404')

        done()
    });

})


// jest.mock('axios')
// jest.mock('cheerio')
// describe('scrapping item', () => {
//     test('success scrap tokopedia', async (done) => {
//         let url = "https://www.tokopedia.com/headtotwo/garage-sale-preloved-cocolatte-carseat-omniguard"
//         const data = {
//             price: 1000,
//             name: 'Kacang',
//             store: 'TokoKacang',
//             stock: 'Ada deh'
//         }

//         const mockScrapper = jest
//             .fn()
//             .mockImplementationOnce(cb => cb(null, data));

//         mockScrapper((_, val) => console.log(val));

//         const result = await axios.get.mockResolvedValue(data);
//         // .toHaveProperty('store', expect.any(String))
//         await expect(scrapper(url))
//         console.log('data Tokopedia', result)
//         done()
//     });
//     test('success scrap bukalapak', async (done) => {
//         let url = "https://www.bukalapak.com/p/fashion-wanita/bolero-cardigan/3ke1vgn-jual-set-blouse-and-pants-light-color"

//         const data = { store: "toko BL", price: 55, name: "tokok", stock: "<5", date: "2020-07-28T10:01:49.393Z" }
//         axios.get.mockImplementationOnce(() => Promise.resolve(data))
//         // const cheer = cheerio.load())
//         // console.log('|||||||', data)
//         console.log('>>>>>>', await cheer)
//         await expect(scrapper(url)).resolves.toHaveProperty(data);

//         // await expect(funct).toHaveProperty('store', expect.any(String))
//         done()
//     });
//     // test('error scrapping', (done) => {

//     //     done()
//     // });

// })
