const Item = require('../models/track')

console.log(Item)
class TrackController {

    static fetchItems(req, res, next) {

        Item.find()
            .then((data) => {
                console.log('hit')
                res.status(200).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }


    static addItem(req, res, next) {

        const newItem = {
            url: String(req.body.url),
            image_url: String(req.body.image_url),
            store_name: String(req.body.store_name),
            initial_price: Number(req.body.initial_price),
            current_price: Number(req.body.current_price),
            history: [{ time: req.body.time, price: req.body.current_price, stock: req.body.stock }],
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

        // console.log(req.params)

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
                res.status(201).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

}

module.exports = TrackController



