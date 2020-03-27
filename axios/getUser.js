const axios = require("axios");
const User = require("../models/user-model").User;

function getUser(accessToken, newUserAllowed = false) {
  const result = axios
    .get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` }
    })
    .then(async response => {
      const profile = response.data;
      if (newUserAllowed) {
        const user = await User.findOne(
          { githubID: profile.id },
          async (error, user) => {
            let returnVal = null;
            if (error !== null) {
              returnVal = { error: error, user: null };
            } else if (user !== null) {
              returnVal = { user: user, error: null };
            } else {
              let newUser = new User({
                githubID: profile.id,
                userName: profile.login,
                thumbnail: profile.avatar_url
              });
              newUser = await newUser.save((error, user) => {
                if (error !== null) {
                  returnVal = { error, user: null };
                } else {
                  returnVal = { error: null, user };
                }
              });
            }
            return returnVal;
          }
        );
        return user;
      } else {
        const user = await User.findOne(
          { githubID: profile.id },
          (error, user) => {
            if (error) {
              return { error: error, user: null };
            } else if (user) {
              return { user, error: null };
            }
          }
        );
        return user;
      }
    })
    .catch(error => {
      return {
        error: "Cannot Get User Data",
        user: null
      };
    });
  return result;
}

module.exports = { getUser };
