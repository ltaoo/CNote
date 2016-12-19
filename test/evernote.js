const fs = require('fs');
const cheerio = require('cheerio');

let content = fs.readFileSync('./index.html');

let $ = cheerio.load(content);

console.log($('en-note')._root['0'].children);

