const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const randomWords = require("random-words");

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/client.html", { words: "hello" });
});

// variable to hold the current correct answer
var answer = "ANSWER NOT DEFINED";
var words = [];
var points = {};

io.on("connection", function(socket) {
  // store username
  var user;
  // prompt user for username
  io.to(socket.id).emit("prompt-username");

  console.log("User connected");

  // send current words to client
  io.to(socket.id).emit("send-words", words);

  // receiving username from client
  socket.on("prompt-username", function(username) {
    user = username;
    points[username] = 0;
    console.log(username);
  });

  // receiving guess from client
  socket.on("user-guess", function(guessInfo) {
    console.log(guessInfo);
    // if guess is correct, increment points
    if (guessInfo.guess == answer) {
      points[guessInfo.username] += 1;
      console.log(points);
      initializeWords();
      socket.emit("send-words", words);
    }
    // if guess incorrect, decrement points
    else {
      points[guessInfo.username] -= 1;
      console.log(points);
    }
  });

  socket.on("disconnect", function() {
    delete points[user];
  });
});

http.listen(3000, function() {
  console.log("Listening on port 3000");
});

// generating words
const initializeWords = () => {
  // generating random words
  words = [randomWords(), randomWords(), randomWords()];
  // selecting which word is the correct answer
  answer = words[Math.floor(Math.random() * words.length)];
};

initializeWords();
