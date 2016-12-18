let createNote = require('./evernote');
let cheerio = require('cheerio');

let fs = require('fs');

fs.readFile('./data/index.html', 'utf8', (err, res) => {
  if(err) console.log(err);

  createNote('wiz 笔记', res);
})