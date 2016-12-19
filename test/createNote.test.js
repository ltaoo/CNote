let createNote = require('../createNote');
let cheerio = require('cheerio');

let fs = require('fs');

fs.readFile('../data/index.html', 'utf8', (err, res) => {
  if(err) console.log(err);

  createNote({
    noteTitle: '新建相同标签笔记',
    noteBody: '如果新建一篇有相同标签的笔记，是会归档到一起吗？',
    created: new Date('2016-10-8').getTime(),
    tagNames: ['test', 'hello world']
  });
})