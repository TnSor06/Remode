const express = require("express");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const mongoose = require("mongoose");
const keys = require("./config/keys");

const app = express();

// set view engine
app.set("view engine", "ejs");

// set up session cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
    name: "RemodeSession"
  })
);

// connect to mongodb
mongoose.connect(
  keys.mongodb.dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log("Cannot connect to Database", err);
    } else {
      console.log("Connected to mongodb");
    }
  }
);

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(3000, () => {
  console.log("app now listening for requests on port 3000");
});
