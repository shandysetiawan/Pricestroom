const Item = require("../models/track");
const { priceWatcher } = require("../bull-cron");

class TrackController {
    static fetchItems(req, res, next) {
        Item.find()

            // Item.find(dataItem)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(500).json({ message: "Internal Server Error", error: err });
            });
    }


    static addItem(req, res, next) {

        function isUrl(s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }
        const { url, imageUrl, storeName, price, stock, name } = req.body
        // console.log(req.body)

        if (isUrl(req.body.url)) {
            if (req.body.url.search("tokopedia") !== -1 || req.body.url.search("bukalapak") !== -1) {
                //nambahin buat ngecek number
                let newItem
                if (typeof price === "number") {
                    newItem = {
                        url,
                        imageUrl,
                        storeName,
                        initialPrice: price,
                        currentPrice: price,
                        history: [{ time: new Date(), price, stock }],
                        targetPrice: null,
                        email: null,
                        createdAt: new Date()
                    }
                } else {
                    newItem = {
                        url,
                        imageUrl,
                        storeName,
                        initialPrice: Number(price.match(/\d+/g).join("")),
                        currentPrice: Number(price.match(/\d+/g).join("")),
                        history: [{ time: new Date(), price: Number(price.match(/\d+/g).join("")), stock }],
                        targetPrice: null,
                        email: null,
                        createdAt: new Date()
                    }
                }
                // console.log(newItem)
                // console.log('priceeeeeee', newItem.initialPrice)

                Item.create(newItem)
                    .then((data) => {
                        const message = { message: "Item has been successfully tracked!" }
                        // console.log('masuk create')
                        priceWatcher(data.ops[0].url)
                        res.status(201).json({ data: data.ops[0], message })
                    })
                    .catch((err) => {
                        res.status(500).json({ message: "Internal Server Error", error: err });
                    })

            } else {
                res.status(400).json({ message: "This website is not supported with our app" })
            }
        } else {
            res.status(400).json({ message: "Invalid url format!" });
        }

    }


    static fetchItem(req, res, next) {
        const { id } = req.params;

        Item.findById(id)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(500).json({ message: "Internal Server Error", error: err });
            });
    }

    static updateItem(req, res, next) {

        const { id } = req.params;

        const { email, targetPrice } = req.body
        let editItem

        if (!email || !targetPrice) {
            return res.status(400).json({ message: "Email and target price must not empty!" });
        } else {
            editItem = {
                email, targetPrice
            }
        }

        Item.updateById(id, editItem)
            .then((data) => {

                if (data.lastErrorObject.updatedExisting === false) {
                    return res.status(400).json({ message: "Id not found" });
                } else {
                    res
                        .status(200)
                        .json({ data, message: "Item email or target price has been successfully updated!" });
                }

            })
            .catch((err) => {
                res.status(500).json({ message: "Internal Server Error", error: err });
            });

    }


    static fetchItem(req, res, next) {
        const { id } = req.params;

        Item.findById(id)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(500).json({ message: "Internal Server Error", error: err });
            });
    }



    static removeItem(req, res, next) {
        const { id } = req.params;

        Item.deleteById(id)
            .then((data) => {
                // console.log(data)
                if (data.deletedCount === 0) {
                    return res.status(400).json({ data, message: "Id not found" });
                } else {
                    return res.status(200).json({ data, message: "Success to delete item!" });
                }
            })
            .catch((err) => {
                res.status(500).json({ message: "Internal Server Error", error: err });
            });
    }
}

module.exports = TrackController;
