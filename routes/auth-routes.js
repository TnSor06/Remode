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
  }).then(async response => {
    if (response.data.access_token) {
      const accessToken = response.data.access_token;
      req.session.accessToken = accessToken;
      const user = await getUser(accessToken, (newUserAllowed = true));
      if (user === null || user === undefined) {
        res.redirect(`/auth/login?error=true&message=No User Found`);
      } else {
        res.redirect("/profile");
      }
    } else {
      res.redirect(
        `/auth/login?error=true&message=Unable to fetch AccessToken`
      );
    }
  });
});

module.exports = router;
