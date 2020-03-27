const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    githubID: String,
    thumbnail: String
});

const containerSchema = new Schema({
    imageName: String,
    imageTag: String,
    liveStatus: Boolean,
    liveIP: String,
    livePort: Number,
    volumeLocation: String,
    options: String
});

const projectSchema = new Schema({
    projectName: String,
    owner: userSchema,
    repoURL: String,
    repoID: String,
    collaborators: [userSchema],
    containers: [containerSchema]
})

const User = mongoose.model('user', userSchema);
const Container = mongoose.model('container', containerSchema);
const Project = mongoose.model('project', projectSchema);

module.exports = { User, Container, Project };
