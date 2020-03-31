const { User, Project, Container } = require("./models/user-model");
async function run() {
  const sampleSuccess = {
    data: {
      project: {
        repoNameWithOwner: "TnSor06/TestRepo4",
        repoURL: "https://github.com/TnSor06/TestRepo4",
        repoID: 251391890
      },
      container1: { image: "python", tag: "3.5" },
      container2: { image: "mongo" }
    },
    message: "Build",
    image: {
      imageName: "tnsor06-testrepo4-node-12",
      imageId: "ae93b1547e92",
      container: "container1"
    }
  };
  const sampleReject = {
    data: {
      project: {
        repoNameWithOwner: "TnSor06/TestRepo1",
        repoURL: "https://github.com/TnSor06/TestRepo1",
        repoID: 251390607
      },
      container1: { image: "python", tag: "3.5" },
      container2: { image: "mongo" }
    },
    message: "Error on build"
  };

  console.log(sampleReject.data.project.repoID, sampleReject.message);
  var query = Project.find({});
  const projects = await Project.find(
    { repoID: sampleReject.data.project.repoID },
    (error, user) => {
      if (error) {
        return { error: error, user: null };
      } else if (user) {
        return { user, error: null };
      }
    }
  );
  return projects;
  //   const updateRejectProject = await Project.findOne(
  //     { repoID: sampleReject.data.project.repoID },
  //     async function(err, doc) {
  //       if (err) {
  //         console.log("ran into error");
  //       }
  //       console.log(doc);
  //       //   doc.status = sampleReject.message;
  //       //   const data = await doc.save(async function(err, data) {
  //       //     console.log(err, data);
  //       //   });
  //     }
  //   );

  //   console.log(updateRejectProject);
}

async function runner() {
  const returnData = await run();
}

runner();
