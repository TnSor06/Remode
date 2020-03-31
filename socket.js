const socket = require("socket.io-client")("http://localhost:3030");

socket.on("newProjectSuccess", data => {
  console.log("newProjectSuccess", data);
});

socket.on("newProjectReject", data => {
  //data={data,message}
  console.log("newProjectReject", data);
});

module.exports = { socket };
