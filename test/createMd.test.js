const fs = require('fs');
const create = require('../src/createMd');

fs.readFile('./index.html', 'utf8', (err, res) => {
  let content = create(res);
  // console.log(content);
  fs.writeFileSync('命令行Foundation项目.md', content, 'utf8');
})