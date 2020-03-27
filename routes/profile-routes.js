const router = require("express").Router();
const getUser = require("../axios/getUser").getUser;

const authCheck = (req, res, next) => {
  if (!req.session) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  const data = getUser(req.session.accessToken);
  console.log("Profile-route is calling ", data);
  if (data.error) {
    res.redirect(`/auth/login?error=true&message=${data.error}`);
  } else {
    res.render("profile", { user: data.user });
  }
});

module.exports = router;
