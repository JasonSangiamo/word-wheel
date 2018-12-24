$(function() {
  var socket = io();
  // send guess to server on submit
  $("form").submit(function() {
    var guessInfo = { guess: $("#m").val(), username: username };
    socket.emit("user-guess", guessInfo);
    $("#m").val("");
    return false;
  });

  // append words to client page
  socket.on("send-words", function(words) {
    $("#messages").append($("<li>").text(words[0]));
    $("#messages").append($("<li>").text(words[1]));
    $("#messages").append($("<li>").text(words[2]));
  });
});
