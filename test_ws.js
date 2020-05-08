var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

var webSocket = require('ws');
 
var url = 'wss://paullightserver.sites.tjhsst.edu/ws/?rpi=true';
var ws = new webSocket(url);

ws.on('open', function() {
	console.log('open')
}) 

ws.on('message', function(msg) {
	var msg = JSON.parse(msg);
	var data = msg.data;

	switch(data) {
		case 'off':
			console.log('off')
			break;
		case 'red':
			console.log('red')
			break;
		default:
		// code block
	}

	console.log('fin')
}) 


server.listen(process.env.PORT || 80);

// ws.onopen = () => {
//   ws.send('Message From Client') 
// }
 
// ws.onerror = (error) => {
//   console.log(error)
// }
 
// ws.onmessage = (e) => {
//   console.log(e.data)
// }
