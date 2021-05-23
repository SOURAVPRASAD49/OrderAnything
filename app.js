require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT;
const bodyParser = require("body-parser");
const allRouters = require("./routes/allRoutes");
const passport = require("passport");
const addItems = require("./helpers/addItem");

// //add items into the db once
// addItems();

//middleware
app.use(bodyParser.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

//routes
app.use("/api", allRouters);

//db connection and server
mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connected");
    app.listen(port, () => {
      console.log(`server started at ${port}`);
    });
  })
  .catch((err) => {
    res.status(401).send(err);
  });
