// var zip = new require('node-zip')();
var fs = require("fs");
var TextDecoder = require('text-encoding').TextDecoder
// zip.file('test.txt', 'hello there');
// var data = zip.generate({base64:false,compression:'DEFLATE'});
// fs.writeFileSync('test.zip', data, 'binary');
let fileName = '命令行Foundation项目.html'
fs.readFile('./data/命令行Foundation项目.md.ziw', (err, res) => {
  if(err) console.log(err)
  let data = res
  var zip = new require('node-zip')(data);
  let content = zip.files['index.html']._data;
  console.log(content.getContent())
  var string = new TextDecoder('utf-8').decode(content.getContent());
  console.log(string)
  // console.log(zip.files['index.html']); // hello there
  // fs.writeFileSync(fileName, content.getContent(), 'utf8')
})