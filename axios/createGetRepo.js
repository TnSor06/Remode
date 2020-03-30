const axios = require("axios");
const { User, Project, Container } = require("../models/user-model");
const getUser = require("../axios/getUser").getUser;

async function createRepo(accessToken, data, userData) {
  if (userData.error) {
    return {
      error: "Unable to retreive user information while creating project",
      repo: null
    };
  }
  const query = `
    mutation {
      createRepository(
        input:{
          name:"${data.projectName}",
          description:"${data.projectDesc}",
          visibility:${data.private ? "PRIVATE" : "PUBLIC"}
        }){
        repository{
          databaseId
          id
          url
          name
          nameWithOwner
          owner{
            id
            login
          }
          collaborators{
            nodes{
              id
              login
            }
          }
        }
      }
    }
  `;
  const result = axios({
    url: "https://api.github.com/graphql",
    method: "post",
    headers: {
      Authorization: `token ${accessToken}`
    },
    data: {
      query: query
    }
  })
    .then(async response => {
      if (response.data.data.createRepository) {
        const user = userData;
        const res = response.data.data.createRepository.repository;

        const project = await Project.findOne(
          { repoNameWithOwner: res.nameWithOwner },
          async (error, project) => {
            let returnVal = null;
            if (error !== null) {
              return { error: error, project: null };
            } else if (project) {
              return {
                error: "Project already exists in database",
                project: null
              };
            } else {
              let newProject = new Project({
                projectName: res.name,
                repoNameWithOwner: res.nameWithOwner,
                owner: user._id,
                repoURL: res.url,
                repoID: res.databaseId,
                status: "Initialized",
                repoNodeId: res.id,
                collaborators: [user._id]
              });
              newProject = await newProject.save(async (error, project) => {
                if (error !== null) {
                  returnVal = await { error, project: null };
                } else {
                  returnVal = await { error: null, project };
                }
              });
            }
            return returnVal;
          }
        );
        return project;
      } else if (response.data.errors) {
        return {
          error: response.data.errors[0].message,
          project: null
        };
      } else {
        return {
          error: "Cannot create repository! Try Again",
          project: null
        };
      }
    })
    .catch(error => {
      return {
        error: "Cannot create repository! Try Again",
        project: null
      };
    });
  return result;
}

module.exports = { createRepo };
