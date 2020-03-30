const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  githubID: String,
  githubNodeID: String,
  thumbnail: String
});

const containerSchema = new Schema({
  imageName: String,
  status: String,
  liveIP: String,
  livePort: Number,
  instanceType: String,
  instanceVersion: String,
  options: String,
  owner: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const projectSchema = new Schema({
  projectName: String,
  repoNameWithOwner: String,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  repoURL: String,
  repoID: String,
  repoNodeId: String,
  status: String,
  collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
  containers: [{ type: Schema.Types.ObjectId, ref: "Container" }]
});

const User = mongoose.model("User", userSchema);
const Container = mongoose.model("Container", containerSchema);
const Project = mongoose.model("Project", projectSchema);

module.exports = { User, Container, Project };
