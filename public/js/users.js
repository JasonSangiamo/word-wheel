var username;
$(function() {
  var socket = io();
  socket.on("prompt-username", function(words) {
    username = prompt("Enter Username: ");
    socket.emit("prompt-username", username);
  });
});
