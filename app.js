#!/usr/bin/nodejs

// -------------- load packages -------------- //
var express = require('express')
var app = express();
var loader = require('./instance_loader.js')
var ws281x = require('rpi-ws281x');


// -------------- express initialization -------------- //
// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM



// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

app.get('/', function(req, res){
    res.send('hola');
});


app.get('/set_pixel', function(req, res){
    var bulb_no = Number( req.query.index );
    var r = Number( req.query.r );
    var g = Number( req.query.g );
    var b = Number( req.query.b );

    var color = instance.exports.make_color(r,g,b);
    
    instance.exports.assign_pixel(strand.wasmPixelPtr, bulb_no, color);
	strand.pixels.set(strand.wasmPixels);

	ws281x.render(strand.pixels);

    res.send(color + "");
});

app.get('/off', function(req, res){
    

    instance.exports.all_off(strand.wasmPixelPtr);
	strand.pixels.set(strand.wasmPixels);

	ws281x.render(strand.pixels);

    res.send("off");
});

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

app.set('port', process.env.PORT || 80 );

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );


});

// -------------- load wasm functions -------------- //
// 
var strand 	 = null;
var instance = null;

loader.load( function(inst) {

	instance = inst;
	configure_ws2811();

})


function configure_ws2811() {

	var config = {leds:500};
	ws281x.configure(config);

    var pixels 		 = new Uint32Array(config.leds);
    var wasmPixelPtr = instance.exports.alloc_pixels(config.leds);
    var wasmPixels	 = new Uint32Array(instance.exports.memory.buffer, wasmPixelPtr, config.leds);

    strand = {
    	'pixels' : pixels,
    	'wasmPixelPtr' : wasmPixelPtr,
    	'wasmPixels' : wasmPixels
    };

}