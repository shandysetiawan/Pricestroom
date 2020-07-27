const Item = require("../models/track");
const { priceWatcher } = require("../bull-cron");
const emailValidator = require('../emailValidator/emailValidator')

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
    let { url, imageUrl, storeName, price, stock, name } = req.body;
    // console.log("line 23", req.body);

    if (isUrl(url)) {
      if (
        url.search("tokopedia") !== -1 ||
        url.search("bukalapak") !== -1
      ) {
        //nambahin buat ngecek number
        let newItem;
        let defaultItem = {
          url,
          name,
          imageUrl,
          storeName,
          email: null,
          targetPrice: null,
          emailNotif: false,
          pushNotif: true,
          priceChangeNotif: true
        };
        if (typeof price === "number") {
          newItem = {
            ...defaultItem,
            initialPrice: price,
            currentPrice: price,
            history: [{ time: new Date(), price, stock }],
            createdAt: new Date()
          };
        } else {
          newItem = {
            ...defaultItem,
            initialPrice: Number(price.match(/\d+/g).join("")),
            currentPrice: Number(price.match(/\d+/g).join("")),
            history: [
              {
                time: new Date(),
                price: Number(price.match(/\d+/g).join("")),
                stock,
              },
            ],
            createdAt: new Date()
          };
        }
        // console.log(newItem)
        // console.log('priceeeeeee', newItem.initialPrice)

        Item.create(newItem)
          .then((data) => {
            const message = { message: "Item has been successfully tracked!" };
            // console.log('masuk create')
            const { url, _id } = data.ops[0];
            // console.log("INTO PRICE WATCHER");
            priceWatcher(url, _id);
            return res.status(201).json({ data: data.ops[0], message });
          })
          .catch((err) => {
            // console.log(err)
            res.status(500).json({ error: err, message: "Internal Server Error" });
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

  static async updateItem(req, res, next) {
    // email validator to check email format and change emailNotif and/or pushNotif
    const { id } = req.params;
    const { email, pushNotif, priceChangeNotif, targetPrice } = req.body

    try {
      const emailValid = await emailValidator(email)

      let editItem
      let emailResult = false
      if (emailValid === "True") {
        // console.log('masuk sini ga')
        emailResult = true
      }

      console.log(emailValid)
      editItem = {
        email,
        pushNotif: !!JSON.parse(String(pushNotif)),
        priceChangeNotif: !!JSON.parse(String(priceChangeNotif)),
        targetPrice,
        emailNotif: emailResult
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

    } catch (error) {
      console.log(error)
    }

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
