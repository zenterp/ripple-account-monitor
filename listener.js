var WebSocket = require('ws'),
    Payment = require('./payment');
var websocketUrl = 'wss://s1.ripple.com';
var rippleAddress = process.env.RIPPLE_ADDRESS;

function onOpen() {
  console.log('connection opened');
  this.send('{"command":"subscribe","id":0,"accounts":["'+rippleAddress+'"]}');
  console.log('listening for activity for account: '+ rippleAddress);
}

function onMessage(data, flags) {
  var response = JSON.parse(data);
  if (response.type == 'transaction') {
    try {
      var payment = new Payment(data);
      console.log(payment.toJSON());
    } catch(e) {
      console.log(e);
    }
  }
}

function onClose() {
  console.log('connection closed')
  delete this;
  connectWebsocket(websocketUrl);
}

function connectWebsocket(url) {
  console.log('connecting to '+url);
  try {
    var ws = new WebSocket(url);
    ws.on('open', onOpen);
    ws.on('message', onMessage);
    ws.on('close', onClose);
  } catch(e) {
    console.log('error connecting', e);
    console.log('trying again...');
    connectWebsocket(url);
  }
}

connectWebsocket(websocketUrl);
