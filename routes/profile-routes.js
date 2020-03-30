const router = require("express").Router();
const getUser = require("../axios/getUser").getUser;
const authCheck = require("../middleware/authCheck")
const querystring = require("querystring");

router.get("/", authCheck, async (req, res) => {
  if(req.session.accessToken){
    const user = await getUser(req.session.accessToken);
    if (user === null || user === undefined) {
      res.redirect(`/auth/login?${querystring.stringify({error:true,message: "No User Found"})}`);
    } else {
      res.render("home", { user: user });
    }
  }else{
    res.render("home",{ user: null })
  }
  
});

module.exports = router;
