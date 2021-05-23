const User = require("../models/user");
const Order = require("../models/order");

const placeOrder = async (req, res) => {
  try {
    const query = { _id: req.user._id };
    const { cart } = await User.findOne(query);
    if (cart.items.length) {
      const order = new Order({
        order_by: req.user._id,
        items: cart.items,
      });
      orderPromise = await order.save();
      const updateObj = {
        $set: {
          cart: { items: [] },
          orders: orderPromise._id,
        },
      };
      const updateUserPromise = await User.findOneAndUpdate(query, updateObj, {
        new: true,
      });
      const [updateUser, orderdata] = await Promise.all([
        updateUserPromise,
        orderPromise,
      ]);
      return res.status(200).json({ data: orderdata });
    } else {
      return res.status(200).json({ message: "Cart is Empty" });
    }
  } catch (err) {
    console.log(err);
    return res.status(504).json({ message: "Something went wrong" });
  }
};

module.exports = {
  placeOrder,
};
