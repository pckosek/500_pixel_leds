const util = require('util');
const fs = require('fs');
var source = fs.readFileSync('./add.wasm');

var typedArray = new Uint8Array(source);


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
  console.log(util.inspect(result, true, 0));
  console.log(result.instance.exports.add(9, 9));
  go(result.instance);
}).catch(e => {
  // error caught
  console.log(e);
});

function go(instance) {
  console.log(instance.exports.add(9, 9));

  console.log(instance.exports)

  let myArrayPtr = instance.exports.alloc_pixels(10);
  let myArray = new Uint32Array(instance.exports.memory.buffer, myArrayPtr, 10);


  for (var i = 0; i <20; i++) {
    instance.exports.tick(myArrayPtr);
    console.log(myArray);
  }

}