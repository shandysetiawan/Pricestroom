let db = require('../config/mongodb.js');
if (process.env.NODE_ENV === "test") db = require('../config/mongotest.js');
const ItemCollection = process.env.COLLECTION_NAME;
const Item = db.collection(ItemCollection);
const { ObjectId } = require('mongodb');

module.exports = class ItemModel {
  static find() {
    return Item.find().toArray()
  }

  static create(newItem) {
    return Item.insertOne(newItem)
  }

  static findById(id) {
    return Item.findOne({ _id: ObjectId(id) })
  }

  static updateById(id, data) {
    return Item.findOneAndUpdate({ _id: ObjectId(id) }, { $set: data }, { returnOriginal: false })
  }

  static deleteById(id) {
    return Item.deleteOne({ _id: ObjectId(id) })
  }
};
