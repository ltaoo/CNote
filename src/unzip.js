// // var zip = new require('node-zip')();
// const fs = require("fs");
// const TextDecoder = require('text-encoding').TextDecoder;
// const unzip = require('node-zip');
// // zip.file('test.txt', 'hello there');
// // var data = zip.generate({base64:false,compression:'DEFLATE'});
// // fs.writeFileSync('test.zip', data, 'binary');

// module.exports = function extractFromWiz(filename) {
//   try {
//     let data = fs.readFileSync(filename);
//     const zip = new unzip(data, {base64: false});
//     let content = zip.files['index.html']._data;
//     // 如果是 Uint8Array
//     // console.log(content.getContent() instanceof Uint8Array);
//     const string = new TextDecoder('UTF-8').decode(content.getContent());
//     // console.log(string);
//     return string;
//     // return;
//     // fs.writeFileSync(filename.replace(/\.ziw/, ''), string, 'utf8');
//   }catch(err) {
//     throw err;
//   }
// }