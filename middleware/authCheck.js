const authCheck = (req, res, next) => {
    if (!req.session) {
      res.redirect("/auth/login");
    } else {
      next();
    }
  };

module.exports = authCheck;