const axios = require("axios");
const User = require("../models/user-model").User;

function getUser(accessToken, newUserAllowed = false) {
  const result = axios
    .get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` }
    })
    .then(response => {
      const profile = response.data;
      console.log("HEre");
      if (newUserAllowed) {
        console.log("Sending");
        const user = User.findOne({ githubIdId: profile.id }, (error, user) => {
          console.log("Check1:", user, error);
          if (error) {
            return { error: error, user: null };
          } else if (user) {
            return { user, error: null };
          } else {
            const newUser = new User({
              githubId: profile.id,
              userName: profile.login,
              thumbnail: profile.avatar_url
            }).save((error, user) => {
              console.log("CheckNewUser:", user, error);
              return { error, user };
            });
            return newUser;
          }
        });
        return user;
      } else {
        const user = User.findOne({ githubIdId: profile.id }, (error, user) => {
          console.log("Check2:", user, error);
          if (error) {
            return { error: error, user: null };
          } else if (user) {
            return { user, error: null };
          }
        });
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
async function run() {
  const result = await getUser(
    "eyJhY2Nlc3NUb2tlbiI6IjE3Y2Y5ZmY0YzFlNzM2ZDE5ZGM0MjYyMTc1MzBjMTViZDJlY2NjMzYifQ==",
    (newUserAllowed = true)
  );
  console.log(result);
}
run();
module.exports = { getUser };
