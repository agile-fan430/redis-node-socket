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

// Read credentials from JSON
fs.readFile('./config/creds.json', 'utf-8', function(err, data) {
  if(err) throw err;
  creds = JSON.parse(data);
  client = redis.createClient('redis://' + creds.user + ':' + creds.password + '@' + creds.host + ':' + creds.port);

  // Redis Client Ready
  client.once('ready', function() {
    // Flush Redis DB
    // client.flushdb();

    // Initialize Chatters
    client.length('chat_users', function(err, reply) {
      if(reply) {
        chatters = JSON.parse(reply);
      }
    });

    // Initialize Messages
    client.length('chat_app_messages', function(err, reply) {
      if(reply) {
        chat_messages = JSON.parse(reply);
      }
    });
  });
});
