var ws281x = require('rpi-ws281x');
const util = require('util');
const fs = require('fs');
var source = fs.readFileSync('./add.wasm');

var typedArray = new Uint8Array(source);
var instance = null;


const env = {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({
      initial: 256
    }),
    table: new WebAssembly.Table({
      initial: 0,
      element: 'anyfunc'
    })
  }

WebAssembly.instantiate(typedArray, {
  env: env
}).then(result => {
    instance = result.instance;
    go();
}).catch(e => {
  // error caught
  console.log(e);
});


class Example {
 
    constructor() {
        console.log('construct')

        // Current pixel position
        this.offset = 0;
 
        // Set my Neopixel configuration
        this.config = {leds:500};
 
        // Configure ws281x
        ws281x.configure(this.config);

        // this.wasmPixelPtr = instance.exports.alloc_pixels(this.config.leds);
        // this.wasmPixels = new Uint32Array(instance.exports.memory.buffer, this.wasmPixelPtr, this.config.leds);

        this.pixels = new Uint32Array(this.config.leds);

        this.wasmPixelPtr = instance.exports.alloc_pixels(this.config.leds);
        this.wasmPixels = new Uint32Array(instance.exports.memory.buffer, this.wasmPixelPtr, this.config.leds);



        // this.wasmPixels.set(this.pixels);

    }
 
    loop() {

        instance.exports.tick(this.wasmPixelPtr);
        this.pixels.set(this.wasmPixels);


        // // // Copy data out to JavaScript.
        // this.pixels.set(this.wasmPixels);

        
 
        // Set a specific pixel
        // pixels[this.offset] = 0xFF0000;
 
        // // Move on to next
        // this.offset = (this.offset + 1) % this.config.leds;
 
        // Render to strip
        ws281x.render(this.pixels);
    }
 
    run() {
        // Loop every 100 ms
        setInterval(this.loop.bind(this), .1);
        // setInterval(this.loop.bind(this), .05);
    }
};
 
function go() {
    var example = new Example();
    example.run();
 }