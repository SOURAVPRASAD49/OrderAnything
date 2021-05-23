const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//validation checking
const validateBody = (body) => {
  if (!body.name) {
    res.status().json({ message: "Name required" });
    return;
  }
  if (!body.phone_number) {
    res.status().json({ message: "Phone Number required" });
    return;
  }
  if (!body.password) {
    res.status().json({ message: "Password required" });
    return;
  }
  return 1;
};

//checking phone_number in db
const checkPhoneNumber = async (phone_number) => {
  const user = await User.findOne({ phone_number: phone_number });
  return user ? false : true;
};

//passport middleware
const isAuth = passport.authenticate("jwt", { session: false });

//Role middleware
const checkRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    next();
  } else {
    return res.status(401).json({
      messgae: "Unauthorized",
    });
  }
};

const RegisterUser = async (req, role, res) => {
  try {
    const isOk = validateBody(req.body);
    const existsPhoneNumber = checkPhoneNumber(req.body.phone_number);
    if (isOk && existsPhoneNumber) {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      const user = new User({
        name: req.body.name,
        phone_number: req.body.phone_number,
        password: hashedPassword,
        role: role,
      });
      await user.save();
      return res.status(201).json({
        message: "User registered successfully!!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(504).json({ message: "Something went wrong" });
  }
};

const loginUser = async (req, role, res) => {
  try {
    const phone_number = req.body.phone_number;
    const password = req.body.password;

    //check in the database if phone_number exists or not
    const user = await User.findOne({ phone_number: phone_number });
    if (!user) {
      return res.status(404).json({
        message: "Phone_number is not found.Invalid login credentials",
      });
    }

    //checking the role of user
    if (user.role !== role) {
      return res.status(403).json({
        message: "Please make sure you are logging in from the right portal",
      });
    }

    //check password

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(403).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { user_id: user._id, role: user.role, name: user.name },
      process.env.ACCESSS_TOKEN,
      { expiresIn: "7 days" }
    );

    const result = {
      name: user.name,
      phone_number: user.phone_number,
      role: user.role,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: "LoggedIn successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(504).json({ message: "Something went wrong" });
  }
};

module.exports = {
  loginUser,
  RegisterUser,
  checkRole,
  isAuth,
};
