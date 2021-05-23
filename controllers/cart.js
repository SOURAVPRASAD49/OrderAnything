const User = require("../models/user");

const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    const query = { _id: req.user._id };
    const updateObj = {
      $set: {
        "cart.items": items,
      },
    };
    const { cart } = await User.findOneAndUpdate(query, updateObj, {
      new: true,
    });
    return res.status(200).json({ data: cart });
  } catch (err) {
    console.log(err);
    return res.status(504).json({ message: "Something went wrong" });
  }
};

const getCart = async (req, res) => {
  try {
    const query = { _id: req.user._id };
    const { cart } = await User.findOne(query).populate({
      path: "cart.items.item_id",
      select: "name category",
    });
    return res.status(200).json({ data: cart });
  } catch (err) {
    console.log(err);
    return res.status(504).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getCart,
  updateCart,
};
