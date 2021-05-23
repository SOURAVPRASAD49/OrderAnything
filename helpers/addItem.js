const Item = require("../models/item");
const itemArray = require("./itemsArray");

module.exports = async () => {
  try {
    const items = await Item.insertMany(itemArray);
    console.log("Items added");
  } catch (err) {
    console.log(err);
  }
};
