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
    },
    getTags(source, md) {
        let tokens = md.parse(source, {});
        tokens = tokens || [];
        // console.log(tokens);
        let notebookName = null;
        let tagNames = null;
        // const notebookToken = tokens.find(token => /^ *@\(.+\)(\[.+\])?$/.test(token.content));
        const notebookToken = tokens.find(token => /^ *@(\[.+\])?$/.test(token.content));
        // console.log(notebookToken);
        if (notebookToken) {
            const matched = notebookToken.content.trim().match(/^ *@(\[(.+)\])?$/);
            // console.log(matched);
            // return;
            // notebookName = matched[1];

            tagNames = matched[2];
            if (tagNames) {
            tagNames = tagNames
              .split('|')
              .map(s => s.trim())
              .filter(s => !!s);
            }
            let reg = new RegExp('@\\[(.+?)\\]',"g");
            source = source.replace(reg, '');
            return {tagNames, source} 
        }

    }
}

