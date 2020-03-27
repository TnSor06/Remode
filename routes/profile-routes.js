const router = require("express").Router();
const getUser = require("../axios/getUser").getUser;

const authCheck = (req, res, next) => {
  if (!req.session) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, async (req, res) => {
  const user = await getUser(req.session.accessToken);
  if (user === null || user === undefined) {
    res.redirect(`/auth/login?error=true&message=No User Found`);
  } else {
    res.render("profile", { user: user });
  }
});

module.exports = router;
