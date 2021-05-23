const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const avaliableSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
  },
  long: {
    type: Number,
  },
});
const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    avaliable_At: [avaliableSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("item", itemSchema);
