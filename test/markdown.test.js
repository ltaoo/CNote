const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();
const juice = require('juice');
const lib = require('../src/lib');
let source = fs.readFileSync(path.join(__dirname, '../note', 'testTags.md'), 'utf8');
const noteInfo = lib.getTags(source, md);
// console.log(noteInfo);
// return;
let html = md.render(noteInfo.source);


let style = fs.readFileSync(path.join(__dirname, '../src/themes', 'github_markdown.css'), 'utf8');
let content = juice.inlineContent(html, style);
// 生成 html
fs.writeFileSync('template.html', content, 'utf8');