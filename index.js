var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

var loader = require('./instance_loader.js')
var ws281x = require('rpi-ws281x');

var webSocket = require('ws');
 
var url = 'wss://paullightserver.sites.tjhsst.edu/ws/?rpi=true';
var ws = new webSocket(url);


var window_array = [0.000000,0.052632,0.105263,0.157895,0.210526,0.263158,0.315789,0.368421,0.421053,0.473684,0.526316,0.578947,0.631579,0.684211,0.736842,0.789474,0.842105,0.894737,0.947368,1.000000,1.000000,0.986486,0.972973,0.959459,0.945946,0.932432,0.918919,0.905405,0.891892,0.878378,0.864865,0.851351,0.837838,0.824324,0.810811,0.797297,0.783784,0.770270,0.756757,0.743243,0.729730,0.716216,0.702703,0.689189,0.675676,0.662162,0.648649,0.635135,0.621622,0.608108,0.594595,0.581081,0.567568,0.554054,0.540541,0.527027,0.513514,0.500000,0.486486,0.472973,0.459459,0.445946,0.432432,0.418919,0.405405,0.391892,0.378378,0.364865,0.351351,0.337838,0.324324,0.310811,0.297297,0.283784,0.270270,0.256757,0.243243,0.229730,0.216216,0.202703,0.189189,0.175676,0.162162,0.148649,0.135135,0.121622,0.108108,0.094595,0.081081,0.067568,0.054054,0.040541,0.027027,0.013514,0.000000];

ws.on('open', function() {
	console.log('open')
}) 

ws.on('message', function(msg) {
	var msg = JSON.parse(msg);
	var data = msg.data;

	switch(data) {
		case 'off':
			console.log('off')
		   	instance.exports.all_off(strand.wasmPixelPtr);
			break;
		case 'redpulse':
			console.log('redpulse')
			var indx = 0;
			function run(){
				var color = instance.exports.make_scaled_color(0,255,0, window_array[indx]);

			   	instance.exports.assign_strand(strand.wasmPixelPtr,color);
				strand.pixels.set(strand.wasmPixels);
				ws281x.render(strand.pixels);
				indx += 1;
				if (indx<window_array.length) {
					setTimeout(run, .05);
				}
			}
			setTimeout(run, .05);
			break;
		case 'greenpulse':
			console.log('greenpulse')
			var indx = 0;
			function run(){
				var color = instance.exports.make_scaled_color(255,0,0, window_array[indx]);

			   	instance.exports.assign_strand(strand.wasmPixelPtr,color);
				strand.pixels.set(strand.wasmPixels);
				ws281x.render(strand.pixels);
				indx += 1;
				if (indx<window_array.length) {
					setTimeout(run, .05);
				}
			}
			setTimeout(run, .05);
			break;
		case 'bluepulse':
			console.log('bluepulse')
			var indx = 0;
			function run(){
				var color = instance.exports.make_scaled_color(0,0,255, window_array[indx]);

			   	instance.exports.assign_strand(strand.wasmPixelPtr,color);
				strand.pixels.set(strand.wasmPixels);
				ws281x.render(strand.pixels);
				indx += 1;
				if (indx<window_array.length) {
					setTimeout(run, .05);
				}
			}
			setTimeout(run, .05);
			break;
		case 'red':
			console.log('red')
		    var color = instance.exports.make_color(0,255,0);
		   	instance.exports.assign_strand(strand.wasmPixelPtr,color);
			// strand.pixels.set(strand.wasmPixels);
			// ws281x.render(strand.pixels);
			break;
		case 'green':
			console.log('green')
		    var color = instance.exports.make_color(255,0,0);
		   	instance.exports.assign_strand(strand.wasmPixelPtr,color);
			// strand.pixels.set(strand.wasmPixels);
			// ws281x.render(strand.pixels);
			break;
		case 'blue':
			console.log('blue')
		    var color = instance.exports.make_color(0,0,255);
		   	instance.exports.assign_strand(strand.wasmPixelPtr,color);
			// strand.pixels.set(strand.wasmPixels);
			// ws281x.render(strand.pixels);
			break;
		default:
		// code block
	}

}) 


server.listen(process.env.PORT || 8080);

// -------------- load wasm functions -------------- //
// 
var strand 	 = null;
var instance = null;
loader.load( function(inst) {

	instance = inst;
	configure_ws2811();
	configure_window();

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

function configure_window() {
    windowPtr = instance.exports.alloc_window(window_array, window_array.length);
}