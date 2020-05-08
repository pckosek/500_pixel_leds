const fs = require('fs');
var source = fs.readFileSync('./add.wasm');

function load(callback) {

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
      callback(instance);
  }).catch(e => {
    throw(e);
  });

}

module.exports.load = load;