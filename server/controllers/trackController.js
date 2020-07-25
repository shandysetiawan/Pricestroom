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
        res.status(500).json({ message: "Internal Server Error" });
      });
  }

  static addItem(req, res, next) {
    function isUrl(s) {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return regexp.test(s);
    }
    const { url, imageUrl, storeName, price, stock, name } = req.body;
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
            name,
            imageUrl,
            storeName,
            initialPrice: price,
            currentPrice: price,
            history: [{ time: new Date(), price: req.body.price, stock }],
            targetPrice: null,
            email: null,
            createdAt: new Date(),
            emailNotif: false,
            pushNotif: true,
            priceChangeNotif: true
          };
        } else {
          newItem = {
            url,
            name,
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
            emailNotif: false,
            pushNotif: true,
            priceChangeNotif: true
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
            res.status(500).json({ message: "Internal Server Error" });
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
        res.status(500).json({ message: "Internal Server Error" });
      });
  }

  static updateItem(req, res, next) {

    const { id } = req.params;

    const { email, pushNotif, priceChangeNotif, targetPrice } = req.body

    const editItem = {
      pushNotif,
      email,
      priceChangeNotif,
      targetPrice
    };

    Item.updateById(id, editItem)
      .then((data) => {
        res
          .status(200)
          .json({ data, message: "Item has been successfully updated!" });
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal Server Error" });
      });
  }

  static removeItem(req, res, next) {
    const { id } = req.params;

    if (id === null || undefined) {
      return res.status(400).json({ message: "No input id" });
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
