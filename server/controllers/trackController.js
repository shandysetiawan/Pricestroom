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
        res.status(500).json(err);
      });
  }

  static addItem(req, res, next) {
    function isUrl(s) {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return regexp.test(s);
    }
    const { url, imageUrl, storeName, price, stock } = req.body;
    console.log("line 23", req.body);

    if (isUrl(req.body.url)) {
      if (
        req.body.url.search("tokopedia") !== -1 ||
        req.body.url.search("bukalapak") !== -1
      ) {
        //nambahin buat ngecek number
        let newItem;
        if (typeof price === "number") {
          newItem = {
            url,
            imageUrl,
            storeName,
            initialPrice: req.body.price,
            currentPrice: req.body.price,
            history: [{ time: new Date(), price: req.body.price, stock }],
            targetPrice: null,
            email: null,
            createdAt: new Date(),
          };
        } else {
          newItem = {
            url,
            imageUrl,
            storeName,
            initialPrice: Number(price.match(/\d+/g).join("")),
            currentPrice: Number(price.match(/\d+/g).join("")),
            history: [
              {
                time: new Date(),
                price: Number(price.match(/\d+/g).join("")),
                stock,
              },
            ],
            targetPrice: null,
            email: null,
            createdAt: new Date(),
          };
        }
        // console.log(newItem)
        // console.log('priceeeeeee', newItem.initialPrice)

        Item.create(newItem)
          .then((data) => {
            const message = { message: "Item has been successfully tracked!" };
            // console.log('masuk create')
            const { url, _id } = data.ops[0];
            priceWatcher(url, _id);
            console.log("success watch")
            res.status(201).json({ data: data.ops[0], message });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res
          .status(400)
          .json({ message: "This website is not supported with our app" });
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
        res.status(500).json(err);
      });
  }

  static updateItem(req, res, next) {
    // if (req.body.email === ) {

    // } else {

    // }

    const { id } = req.params;

    Item.findById(id)
      .then((data) => {
        let dataHistory = data.history;
        let history = {
          time: req.body.time,
          price: req.body.current_price,
          stock: req.body.stock,
        };
        let pushHistory = [...dataHistory, history];

        // const editItem = {
        //     url: String(req.body.url),
        //     image_url: String(req.body.image_url),
        //     store_name: String(req.body.store_name),
        //     initial_price: Number(req.body.initial_price),
        //     current_price: Number(req.body.current_price),
        //     history: pushHistory,
        //     targetPrice: req.body.targetPrice,
        //     email: req.body.email
        // }

        const editItem = {
          current_price: req.body.current_price,
          history: pushHistory,
          targetPrice: req.body.targetPrice,
          email: req.body.email,
        };

        Item.updateById(id, editItem)
          .then((data) => {
            res
              .status(200)
              .json({ message: "Item history has been successfully updated!" });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static removeItem(req, res, next) {
    const { id } = req.params;

    if (id === null || undefined) {
      res.status(400).json({ message: "No input id" });
    }

    Item.deleteById(id)
      .then((data) => {
        res.status(200).json({ message: "Success to delete item!" });
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal Server Error" });
      });
  }
}

module.exports = TrackController;
