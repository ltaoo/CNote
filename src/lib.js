const cheerio = require('cheerio');
module.exports = {
    // 提取印象笔记正文
    getContent(xml) {
        // 从印象笔记的 en-note 标签内获取真正的内容
        let $ = cheerio.load(xml);
        let body = $("en-note");
        // console.log(body);
        // ok 能够正常获取到
        let note = body['0'].children[0];
        console.log(body);
        return note.data;
    }
}

