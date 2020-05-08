#!/usr/bin/nodejs

// -------------- load packages -------------- //
var express = require('express')
var app = express();
var http = require('http');
var server = http.createServer(app);

var hbs = require('hbs');


var webSocket = require('ws');
var url  = require('url');
var uuid = require('uuid')

app.set('view engine', 'hbs');


// -------------- express initialization -------------- //

// Here, we set the port (these settings are specific to our site)
app.set('port', process.env.PORT || 8080 );


// -------------- express 'get' handlers -------------- //


app.get('/', function (req, res) {
    res.render('home');
});

app.get('/off', function(req, res){
    var msg = { 'data' : 'off' }
    notify_terminal( JSON.stringify(msg) );
    res.send('ok')
});

/* ------------------- */

app.get('/red', function(req, res){
    var msg = { 'data' : 'red' }
    notify_terminal( JSON.stringify(msg) );
    res.send('ok')
});

app.get('/green', function(req, res){
    var msg = { 'data' : 'green' }
    notify_terminal( JSON.stringify(msg) );
    res.send('green')
});

app.get('/blue', function(req, res){
    var msg = { 'data' : 'blue' }
    notify_terminal( JSON.stringify(msg) );
    res.send('blue')
});

/* ------------------- */

app.get('/redpulse', function(req, res){
    var msg = { 'data' : 'redpulse' }
    notify_terminal( JSON.stringify(msg) );
    res.send('ok')
});

app.get('/greenpulse', function(req, res){
    var msg = { 'data' : 'greenpulse' }
    notify_terminal( JSON.stringify(msg) );
    res.send('green')
});

app.get('/bluepulse', function(req, res){
    var msg = { 'data' : 'bluepulse' }
    notify_terminal( JSON.stringify(msg) );
    res.send('blue')
});



// -------------- webSocket stuff -------------- //
//

var sockets = {
    'rpi' : {},
}

var wss = new webSocket.Server({ server });
wss.on('connection', function connection(ws, req) {

    var options = url.parse(req.url, true).query;
    console.log(options)

    if ( options.rpi == 'true' ) {
        console.log('terminal')
	    ws.id = uuid.v4();

        ws.on('message',function(message){
            notify_clients(message);
        });
	    ws.on('close', function() {
	        console.log( 'rpi connection terminating')
	        delete sockets.rpi.terminal;
	    })	    
        sockets.rpi['terminal'] = ws;

	} 
	
});

function notify_clients(message) {
}

function notify_terminal(message) {
    for (var key in sockets.rpi) {
	    sockets.rpi[key].send(message);
	}
}

// console.log(wss)

// -------------- express listener -------------- //

server.listen(process.env.PORT || 8080 );

// var listener = server.listen(app.get('port'), function() {
//   console.log( 'Express server started on port: '+listener.address().port );
// });