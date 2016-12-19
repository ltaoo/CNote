const fs = require('fs');
const path = require('path');

// 解压压缩包
const unzip = require('./unzip');
const create = require('./createMd');
// 为知笔记目录
let wizPath = 'C:\\Users\\what\\Documents\\My Knowledge\\Data\\litaowork@aliyun.com';
try {
  var files = fs.readdirSync(wizPath);
} catch(err) {
  throw err;
}
// let count = 0;
files.forEach(dir => {
  fs.stat(path.join(wizPath, dir), (err, stats) => {
    if(err) throw err;

    if(stats.isDirectory() && dir.indexOf('.') === -1) {
      // 如果是文件夹
      try {
        // 在当前目录新建对应的文件夹
        let notebookPath = path.join(__dirname, dir);
        if(!fs.existsSync(notebookPath)) {
          fs.mkdirSync(notebookPath);
        }
        // 然后读取文件夹里面的文件，这里的就是笔记了
        let notes = fs.readdirSync(path.join(wizPath, dir));
        // count += notes.length;
        // 在这里可以解压笔记，获取笔记内容
        notes.forEach(note => {
          if(note.indexOf('md') > -1) {
            // 如果不是 md 笔记
            let content = unzip(path.join(wizPath, dir, note));
            // 将笔记生成 md 文件
            let notename = path.join(notebookPath, note.replace(/\.ziw/, ''));
            let md = create(content, note);
            fs.writeFileSync(notename, md, 'utf8');
          }
        })
      }catch(err) {
        // throw err;
        console.log(err);
      }
    }

  })
})
