const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    order_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
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
    assigned_to: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: [
        "ORDER PLACED",
        "ITEMS PICKED",
        "ENROUTE",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "ORDER PLACED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
