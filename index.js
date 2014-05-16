"use strict";

/*
  Use the Ripple Account Monitor to recieve
  notifications about a particular ripple account
  as they come in, beginning at a point 
  specified by you in the configuration.
  
  The Account Monitor binds to a local tcp socket
  and using ZeroMQ sends notifications to a client
  process for handling.  It obtains notifications
  by polling the account notifications endpoint of
  a Ripple REST server specified in the configuration

  When the client disconnects from the ZeroMQ socket
  the Account Monitor halts its operation. Upon
  reconnection of the client the Account Monitor
  resumes polling Ripple REST

*/
var config = require(__dirname+"/config/config.js");
var request = require("request");
var zmq = require("zmq");

var TIMEOUT = config.get("timeout");;
var PULLER_CONNECTED = false;

var pusher = zmq.socket("push");
pusher.bindSync(config.get("socket"));
pusher.monitor();
pusher.on("accept", function(){ 
  console.log("client connected");
  PULLER_CONNECTED = true;
});
pusher.on("disconnect", function(){ 
  console.log("client disconnected");
  PULLER_CONNECTED = false;
});
process.on('SIGINT', function() { 
  pusher.close();
  console.log('closed socket:', config.get("socket"));
  process.exit(-1);
});

function getNextNotification(callback){
  getNotification(config.get('lastTransactionHash'), function(err, notification){
    if (err) { 
      setTimeout(function(){
        callback(callback);
      }, TIMEOUT); 
      return;
    }
    if (notification.next_hash) {
      getNotification(notification.next_hash, function(err, newNotification){
        if (err) {
          setTimeout(function(){
            callback(callback);
          }, TIMEOUT);
          return;
        }
        handleNewNotification(newNotification, function(){
          callback(callback);
        });
      });
    } else {
      setTimeout(function(){
        callback(callback);
      }, TIMEOUT);
    }
  });
}

function getNotification(hash, fn) {
  var rippleRestServerUrl = config.get("rippleRestServerUrl");
  var account = config.get('account');
  var url = rippleRestServerUrl+"v1/accounts/"+account+'/notifications/'+hash;

  if (PULLER_CONNECTED){
    request.get({ url: url, json: true }, function(err, resp, body){
      if (body && body.success && body.notification) {
        fn(null, body.notification);
      } else {
        fn(err, null);
      }
    });
  } else {
    fn('disconnected', null);
  }
}

function handleNewNotification(notification, done){
  if (notification){
    if (PULLER_CONNECTED){
      var value = JSON.stringify(notification);
      pusher.send(value);
      config.set('lastTransactionHash', notification.hash); 
      config.save(done);
    } else {
      done();
    }
  } else {
    done();
  }
}

getNextNotification(getNextNotification);

