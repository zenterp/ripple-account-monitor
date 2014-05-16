/*
  Example implementation of a client for a Ripple
  Account Listener. ZeroMQ language bindings exist
  of dozens of programming languages, making the 
  Account Listener more platform independent.

  If this client disconnects from the socket the 
  Account Listener will pause until you reconnect.
  This system currently supports one puller process
  concurrently.

  Before starting this test, run `node index.js`
  to start the Account Listener process. `node index.js`
  may also be performed after starting  the puller.

  Run this test with `npm test` or `node test/puller.js`
*/
"use strict";

var config = require(__dirname+'/../config/config.js');
var zmq = require('zmq');
var socket = config.get("socket");
var puller = zmq.socket("pull");

puller.connect(socket);
puller.on('message', function(message){
  try {
    var notification = JSON.parse(message.toString());
    console.log('NOTIFICATION', notification);
  } catch (err) {
    console.log('invalid JSON error', err); 
    console.log('NOTIFICATION', message.toString());
  }
});

process.on('SIGINT', function() { 
  console.log('Shutting off puller'); 
  puller.disconnect(socket);
  process.exit(-1);
});

