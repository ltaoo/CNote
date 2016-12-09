var zip = new require('node-zip')();
var fs = require("fs");
zip.file('test.txt', 'hello there');
var data = zip.generate({base64:false,compression:'DEFLATE'});
fs.writeFileSync('test.zip', data, 'binary');