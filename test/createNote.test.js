let createNote = require('../evernote');
let cheerio = require('cheerio');

let fs = require('fs');

fs.readFile('../data/index.html', 'utf8', (err, res) => {
  if(err) console.log(err);

  createNote({
    noteTitle: '测试完整笔记',
    noteBody: res,
    created: new Date('2016-10-8').getTime()
  });
})