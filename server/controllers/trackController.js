const Item = require('../models/track')

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


    static addItem(req, res, next) {

        function isUrl(s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }
        const { url, imageUrl, storeName, price, stock } = req.body
        console.log(req.body)

        if (isUrl(req.body.url)) {
            if (req.body.url.search("tokopedia") !== -1 || req.body.url.search("bukalapak") !== -1) {
                //nambahin buat ngecek number
                if (typeof price === "number") {
                    const newItem = {
                        url,
                        imageUrl,
                        storeName,
                        initialPrice: req.body.price,
                        currentPrice: req.body.price,
                        history: [{ time: new Date(), price: req.body.price, stock }],
                        targetPrice: null,
                        email: null
                    }
                } else {
                    const newItem = {
                        url,
                        imageUrl,
                        storeName,
                        initialPrice: Number(price.match(/\d+/g).join("")),
                        currentPrice: Number(price.match(/\d+/g).join("")),
                        history: [{ time: new Date(), price: Number(price.match(/\d+/g).join("")), stock }],
                        targetPrice: null,
                        email: null
                    }
                }
                // console.log(newItem)
                // console.log('priceeeeeee', newItem.initialPrice)

                Item.create(newItem)
                    .then((data) => {
                        const message = { message: "Item has been successfully tracked!" }
                        // console.log('masuk create')
                        res.status(201).json({ data: data.ops[0], message })
                    })
                    .catch((err) => {
                        res.status(500).json(err)
                    })

            } else {
                res.status(400).json({ message: "This website is not supported with our app" })
            }
        } else {
            res.status(400).json({ message: "Invalid url format!" })
        }

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
        let editItem

        if (!req.body.targetPrice && req.body.email) {
            editItem = { email: req.body.email }
        } else if (req.body.targetPrice && !req.body.email) {
            editItem = { targetPrice: req.body.targetPrice }
        } else {
            editItem = {
                targetPrice: Number(req.body.targetPrice),
                email: req.body.email
            }
        }


        Item.updateById(id, editItem)
            .then((data) => {
                res.status(200).json({ message: 'Item email or target price has been successfully updated!' })
            })
            .catch((err) => {
                res.status(500).json(err)
            })

    }

    static removeItem(req, res, next) {

        const { id } = req.params

        // console.log('>>>>>>', id)

        // if (id === null || id === undefined) {
        //     console.log('ada yang kesini ga')
        //     return res.status(400).json({ message: "No input id" })
        // }

        Item.deleteById(id)
            .then((data) => {
                res.status(200).json({ message: "Success to delete item!" })
            })
            .catch((err) => {
                console.log('errrorrr', err)
                res.status(500).json({ message: "Internal Server Error", error: err })
            })
    }

}

module.exports = TrackController