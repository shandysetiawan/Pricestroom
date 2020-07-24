const Item = require('../models/track')
const { tokopediaScraper } = require('../scrapers/index')

console.log(Item)
class TrackController {

    static fetchItems(req, res, next) {

        Item.find()

            // Item.find(dataItem)
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }


    static async addItem(req, res, next) {

        function isUrl(s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }

        const url = req.body.url
        let scrapItem

        if (isUrl(req.body.url)) {
            if (req.body.url.search("tokopedia") === 12) {
                scrapItem = await tokopediaScraper(url)
            } else if (req.body.url.search("bukalapak") === 10) {
                scrapItem = await bukalapakScrapper(url)
            } else {
                res.status(400).json({ message: "This url is not supported with our app" })
            }
        } else {
            res.status(500).json({ message: "Invalid url format!" })
        }

        const newItem = {
            url: url,
            imageUrl: req.body.image_url,
            storeName: scrapItem.storeName,
            initialPrice: scrapItem.price,
            currentPrice: req.body.price,
            history: [{ time: scrapItem.date, price: scrapItem.price, stock: scrapItem.stock }],
            targetPrice: req.body.targetPrice,
            email: req.body.email
        }

        Item.create(newItem)
            .then((data) => {
                const message = { message: "Item has been successfully tracked!" }

                res.status(201).json(data.ops[0], message)
            })
            .catch((err) => {
                res.status(500).json(err)
            })

    }

    static fetchItem(req, res, next) {

        const { id } = req.params

        Item.findById(id)
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })

    }

    static updateItem(req, res, next) {


        const { id } = req.params

        Item.findById(id)
            .then((data) => {

                let dataHistory = data.history
                let history = { time: req.body.time, price: req.body.current_price, stock: req.body.stock }
                let pushHistory = [...dataHistory, history]

                const editItem = {
                    url: String(req.body.url),
                    image_url: String(req.body.image_url),
                    store_name: String(req.body.store_name),
                    initial_price: Number(req.body.initial_price),
                    current_price: Number(req.body.current_price),
                    history: pushHistory,
                    targetPrice: req.body.targetPrice,
                    email: req.body.email
                }

                Item.updateById(id, editItem)

            })
            .then((data) => {
                res.status(201).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })

    }

    static removeItem(req, res, next) {

        const { id } = req.params

        Item.deleteById(id)
            .then((data) => {
                res.status(201).json({ message: "Success to delete item!" })
            })
            .catch((err) => {
                res.status(500).json({ message: err })
            })
    }

}

module.exports = TrackController



