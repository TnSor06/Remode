const socket = require("socket.io-client")("http://localhost:3030");
const { User, Project, Container } = require("./models/user-model");

socket.on("newProjectSuccess", async data => {
  const projects = await Project.findOne(
    { repoID: data.data.project.repoID },
    async (error, project) => {
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
          if (error !== null) {
            console.log("Error while updating project Container", err);
          }
          socket.emit(`repoID`, {
            repoID: project.repoID,
            status: project.status
          });
          socket.emit(`newProjectRegister`, data);
          return project;
        });
      }
    }
  );
});

socket.on("newProjectReject", async data => {
  //data={data,message}
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
          socket.emit(`repoID`, {
            repoID: project.repoID,
            status: project.status
          });
          return project;
        });
      }
    }
  );
});

socket.on("newProjectRegisterSuccess", async data => {
  console.log("Register Success", JSON.stringify(data));
  const projectData = data.data.project;
  const projects = await Project.findOne(
    { repoID: projectData.repoID },
    async (error, project) => {
      const hasDB = "hasDB" in data.data ? true : false;
      if (error) {
        return { error: error, project: null };
      } else if (project) {
        let value =
          project.status === "Finished 1/2" && hasDB
            ? "Registered 1/2"
            : project.status === "Built" && hasDB
            ? "Registered"
            : project.status === "Build" && !hasDB
            ? "Registered"
            : "Error";
        project.status = value;
        await project.save((err, project) => {
          if (error !== null) {
            console.log("Error while updating project Container", err);
          }
          socket.emit(`repoID`, {
            repoID: project.repoID,
            status: project.status
          });
          return project;
        });
      }
    }
  );
  // Adding container
});

socket.on("newProjectRegisterReject", async data => {
  //data={data,message}
  console.log("Register Reject", JSON.stringify(data));
  const projectData = data.data.project;
  const projects = await Project.findOne(
    { repoID: projectData.repoID },
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
          socket.emit(`repoID`, {
            repoID: project.repoID,
            status: project.status
          });
          return project;
        });
      }
    }
  );
});

module.exports = { socket };
