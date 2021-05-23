const express = require("express");
const router = express.Router();
const User = require("../models/user");

const {
  RegisterUser,
  loginUser,
  isAuth,
  checkRole,
} = require("../controllers/auth");

const {
  getAllOrders,
  getAllDeliveryPerson,
  assignDeliveryPersonToOrder,
} = require("../controllers/admin");

const { getCart, updateCart } = require("../controllers/cart");

const { getItems } = require("../controllers/item");

const { placeOrder } = require("../controllers/orders");

const { deliveryPerson } = require("../controllers/deliveryPerson");

//user routes
router.post("/register-user", async (req, res) => {
  await RegisterUser(req, "customer", res);
});

router.post("/login-user", async (req, res) => {
  await loginUser(req, "customer", res);
});

router.get("/items", getItems);

router.get("/cart", isAuth, checkRole(["customer"]), getCart);

router.post("/order", isAuth, checkRole(["customer"]), placeOrder);

router.patch("/cart", isAuth, checkRole(["customer"]), updateCart);

//admin routes
router.post("/register-admin", async (req, res) => {
  await RegisterUser(req, "admin", res);
});

router.post("/login-admin", async (req, res) => {
  await loginUser(req, "admin", res);
});

router.get("/allorders", isAuth, checkRole(["admin"]), getAllOrders);

router.get(
  "/deliveryperson",
  isAuth,
  checkRole(["admin"]),
  getAllDeliveryPerson
);

router.patch(
  "/order/update",
  isAuth,
  checkRole(["admin"]),
  assignDeliveryPersonToOrder
);

//delivery_person routes
router.post("/register-delivery-person", async (req, res) => {
  await RegisterUser(req, "delivey_person", res);
});

router.post("/login-delivery-person", async (req, res) => {
  await loginUser(req, "delivey_person", res);
});

router.patch(
  "/delivery/order/update",
  isAuth,
  checkRole("delivey_person"),
  deliveryPerson
);

module.exports = router;
