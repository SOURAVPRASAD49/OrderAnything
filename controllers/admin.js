const orderModel = require("../models/order");
const userModel = require("../models/user");

const getAllOrders = async (req, res) => {
  try {
    const orderQuery = {};
    if (req.query.status) {
      orderQuery.status = req.query.status;
    }
    const order = await orderModel.find(orderQuery);
    return res.status(200).json({ data: order });
  } catch (err) {
    console.log(err);
    return res.status(504).json({ message: "Something went wrong" });
  }
};

const getAllDeliveryPerson = async (req, res) => {
  try {
    const userQuery = { role: "delivey_person" };
    if (req.query.available) {
      userQuery.orderAlloted = false;
    }
    const deliveryPersons = await userModel.find(userQuery);
    return res.status(200).json({ data: deliveryPersons });
  } catch (err) {
    console.log(err);
    return res.status(504).json({ message: "Something went wrong" });
  }
};

const assignDeliveryPersonToOrder = async (req, res) => {
  try {
    const deliveryPersonId = req.body.id;
    const orderId = req.body.order_id;
    const userQuery = { _id: deliveryPersonId };
    const orderQuery = { _id: orderId };
    const updateObjUser = {
      $set: { orderAlloted: true, orderAllotedId: orderId },
    };
    const updateObjOrder = {
      $set: { assigned_to: deliveryPersonId },
    };
    const userAlloted = userModel.findOneAndUpdate(userQuery, updateObjUser, {
      new: true,
    });
    const updatedOrder = orderModel.findOneAndUpdate(
      orderQuery,
      updateObjOrder,
      { new: true }
    );
    const data = await Promise.all([userAlloted, updatedOrder]);
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(504).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getAllOrders,
  getAllDeliveryPerson,
  assignDeliveryPersonToOrder,
};
