const util = require('util');
const loader = require('./instance_loader.js')


loader.load(go)


function go(instance) {
    console.log(instance.exports.make_color(0,1,255));
}