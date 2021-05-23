const orderModel = require("../models/order");
const userModel = require("../models/user");

const StatusArray = [
  "ORDER PLACED",
  "ITEMS PICKED",
  "ENROUTE",
  "DELIVERED",
  "CANCELLED",
];

const deliveryPerson = async (req, res) => {
  try {
    const query = { _id: req.user._id };
    const user = await userModel.findOne(query);
    const status = req.body.status;
    isValidStatus = StatusArray.indexOf(status);
    if (isValidStatus !== -1) {
      const queryOrder = { _id: user.orders };
      const updateObj = { $set: { status } };
      const updatedOrder = await orderModel.findOneAndUpdate(
        queryOrder._id,
        updateObj,
        { new: true }
      );
      console.log(updatedOrder);
      res.status(200).json({ data: updatedOrder });
      if (updatedOrder.status === "DELIVERED") {
        userUpdateObj = {
          $set: {
            orderAlloted: false,
            orderAllotedId: null,
          },
        };
        const updateUser = await userModel.findOneAndUpdate(
          query,
          userUpdateObj,
          { new: true }
        );
      }
    } else {
      return res.status(200).json({ message: "Status Not Valid" });
    }
  } catch (err) {
    console.log(err);
    return res.status(504).json({ message: "Something went wrong" });
  }
};

module.exports = {
  deliveryPerson,
};
