const router = require("express").Router();
const querystring = require("querystring");

const getUser = require("../axios/getUser").getUser;
const createRepo = require("../axios/createGetRepo").createRepo;
const Project = require("../models/user-model").Project;
const authCheck = require("../middleware/authCheck");

router.get("/create-project", authCheck, async (req, res) => {
  const error = true ? req.query.error : false;
  const message = req.query.message ? req.query.message : "";
  if (req.session.accessToken) {
    const user = await getUser(req.session.accessToken);
    if (user === null || user === undefined) {
      res.redirect(
        `/auth/login?${querystring.stringify({
          error: true,
          message: "No User Found"
        })}`
      );
    } else {
      res.render("project/createProject", { user: user, error, message });
    }
  } else {
    res.redirect(
      `/auth/login?${querystring.stringify({
        error: true,
        message: "Need to login"
      })}`
    );
  }
});

router.post("/create-project", authCheck, async (req, res) => {
  const user = await getUser(req.session.accessToken);
  const reposCount = await Project.countDocuments(
    { owner: user._id },
    (err, count) => {
      if (err) {
        console.log("Error in Database", err);
      }
      return count;
    }
  );
  if (reposCount > 5) {
    res.redirect(
      `/projects/create-project?${querystring.stringify({
        error: true,
        message: "You cannot create more than 5 projects"
      })}`
    );
  }
  const data = await createRepo(req.session.accessToken, req.body, user);
  if (data === null) {
    // init containers
    console.log(req.body);
    res.redirect("/projects");
  } else if (data.error) {
    res.redirect(
      `/projects/create-project?${querystring.stringify({
        error: true,
        message: data.error
      })}`
    );
  }
});

router.get("/", authCheck, async (req, res) => {
  if (req.session.accessToken) {
    const user = await getUser(req.session.accessToken);
    if (user === null || user === undefined) {
      res.redirect(
        `/auth/login?${querystring.stringify({
          error: true,
          message: "No User Found"
        })}`
      );
    } else {
      const projects = await Project.find(
        { $or: [{ owner: user._id }, { collaborators: { $in: [user._id] } }] },
        (error, user) => {
          if (error) {
            return { error: error, user: null };
          } else if (user) {
            return { user, error: null };
          }
        }
      );
      res.render("project/project", { user: user, projects });
    }
  } else {
    res.redirect(
      `/auth/login?${querystring.stringify({
        error: true,
        message: "Need to login"
      })}`
    );
  }
});

router.get("/:id", authCheck, async (req, res) => {
  if (req.session.accessToken) {
    const user = await getUser(req.session.accessToken);
    if (user === null || user === undefined) {
      res.redirect(
        `/auth/login?${querystring.stringify({
          error: true,
          message: "No User Found"
        })}`
      );
    } else {
      // const projects = await Project.find(
      //     { $or:[{ owner.githubID : user.githubID }] },
      //     (error, user) => {
      //       if (error) {
      //         return { error: error, user: null };
      //       } else if (user) {
      //         return { user, error: null };
      //       }
      //     }
      //   );
      res.render("project/project", { user: user });
    }
  } else {
    res.redirect(
      `/auth/login?${querystring.stringify({
        error: true,
        message: "Need to login"
      })}`
    );
  }
});

module.exports = router;
