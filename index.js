var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');
var creds = '';

var redis = require('redis');
var client = '';
var port = process.env.PORT || 8080;

// Express Middleware for serving static
// files and parsing the request body
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Start the server
http.listen(port, function() {
  console.log("Server started. Listening on *:" + port);
});

// Store people in chatroom
var chatters = [];

// Store messages in chatroom
var chat_messages = [];