const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  items: [
    {
      item_id: {
        type: Schema.Types.ObjectId,
        ref: "item",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "customer",
      enum: ["customer", "delivey_person", "admin"],
    },
    orders: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
    cart: cartSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
