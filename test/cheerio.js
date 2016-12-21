const fs = require('fs');
const cheerio = require('cheerio');

fs.readFile('../note/我的第一个笔记本/test.md', 'utf8', (err, res) => {
    if(err) console.log(err);

    const content = res;
    const $ = cheerio.load(content);

    let body = $('en-note');

    // console.log(body);
    // ok 能够正常获取到
    let note = body['0'].children[0];
    console.log(note.data);
})