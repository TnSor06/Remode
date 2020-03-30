const router = require("express").Router();
const axios = require("axios");
const querystring = require("querystring");
const getUser = require("../axios/getUser").getUser;
const keys = require("../config/keys");

// auth login
router.get("/login", async (req, res) => {
  const error = true ? req.query.error : false;
  const message = req.query.message ? req.query.message : "";
  if (req.session.accessToken) {
    const user = await getUser(req.session.accessToken);
    if (user) {
      res.redirect("/");
    }
  }
  res.render("login", { user: req.user, error, message });
});

// auth logout
router.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

router.get("/github", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${keys.github.clientID}&redirect_uri=${keys.github.callbackURL}&scope=user%20repo`
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
        res.redirect(
          `/auth/login?${querystring.stringify({
            error: true,
            message: "No User Found"
          })}`
        );
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect(
        `/auth/login?${querystring.stringify({
          error: true,
          message: "Unable to fecth access token"
        })}`
      );
    }
  });
});

module.exports = router;
