const router = require("express").Router();
const axios = require("axios");

const getUser = require("../axios/getUser").getUser;
const keys = require("../config/keys");

// auth login
router.get("/login", (req, res) => {
  const error = true ? req.query.error : false;
  const message = req.query.message ? req.query.message : "";
  res.render("login", { user: req.user, error, message });
});

// auth logout
router.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

router.get("/github", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${keys.github.clientID}&redirect_uri=${keys.github.callbackURL}`
  );
});

router.get("/github/callback", (req, res) => {
  // res.send(req.user);
  const requestToken = req.query.code;
  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token`,
    data: {
      client_id: keys.github.clientID,
      client_secret: keys.github.clientSecret,
      code: requestToken
    },
    headers: {
      accept: "application/json"
    }
  }).then(response => {
    const accessToken = response.data.access_token;
    req.session.accessToken = accessToken;
    const data = getUser(accessToken, (newUserAllowed = true));
    console.log("Auth is calling ", data);
    if (data.error) {
      res.redirect(`/auth/login?error=true&message=${data.error}`);
    } else {
      res.redirect("/profile");
    }
  });
});

module.exports = router;
