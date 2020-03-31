const socket = require("socket.io-client")("http://localhost:3030");
const { User, Project, Container } = require("./models/user-model");

socket.on("newProjectSuccess", async data => {
  console.log("newProjectSuccess", data);
  const projects = await Project.findOne(
    { repoID: data.data.project.repoID },
    async (error, project) => {
      console.log("Within", error, project);
      const hasDB = "hasDB" in data.data ? true : false;
      if (error) {
        return { error: error, project: null };
      } else if (project) {
        let returnVal = null;
        let value =
          project.status === "Initialized" && hasDB
            ? "Finished 1/2"
            : project.status === "Finished 1/2" && hasDB
            ? "Built"
            : project.status === "Initialized" && !hasDB
            ? "Built"
            : "Error";
        project.status = value;
        await project.save((err, project) => {
          console.log("In save", err, project);
          if (error !== null) {
            console.log("Error while updating project Container", err);
          }
          return project;
        });
      }
    }
  );
  //Adding container
});

socket.on("newProjectReject", async data => {
  //data={data,message}
  console.log("newProjectReject", data);
  const projects = await Project.findOne(
    { repoID: data.data.project.repoID },
    async (error, project) => {
      if (error) {
        return { error: error, project: null };
      } else if (project) {
        let returnVal = null;
        project.status = data.message;
        await project.save((err, project) => {
          console.log("In save", err, project);
          if (error !== null) {
            console.log("Error while updating project Container", err);
          }
          return project;
        });
      }
    }
  );
});

module.exports = { socket };
