let db = require("../config/mongodb.js");
if (process.env.NODE_ENV === "test") db = require("../config/mongotest.js");
const ItemCollection = process.env.COLLECTION_NAME;
const Item = db.collection(ItemCollection);
const { ObjectId } = require("mongodb");

module.exports = class ItemModel {
  static find(data) {
    let dataItem = [];

    // for (let i = 0; i < data.length; i++) {
    //   dataItem.push(new ObjectId(data[i]))
    // }

    // { "_id": { "$in": dataItem } }

    return Item.find().toArray();
  }

  static findAll() {
    return Item.find().toArray()
  }

  // static updateHistory(url) {
  //   return Item.updateMany({ url }, { $set: data })
  // }

  static create(newItem) {
    return Item.insertOne(newItem);
  }

  static findById(id) {
    return Item.findOne({ _id: ObjectId(id) });
  }

  static findByUrl(url) {
    return Item.findOne({ url: url });
  }

  static updateById(id, data) {
    return Item.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: data },
      { returnOriginal: false }
    );
  }

  static deleteById(id) {
    return Item.deleteOne({ _id: ObjectId(id) });
  }

  static deleteMany() {
    return Item.remove({});
  }
};
