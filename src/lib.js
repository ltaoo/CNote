const cheerio = require('cheerio');
const fs =require('fs');
const path = require('path');

module.exports = {
    // 将本地数据库提交至印象笔记
    updateDb() {
        
    },
    // 从印象笔记获取实时更新的数据库
    parseDb(xml) {
        let $ = cheerio.load(xml);
        let body = $("en-note");
        return body['0'].children[0].data;
    },
    // 提取印象笔记正文
    getContent(xml) {
        // 从印象笔记的 en-note 标签内获取真正的内容
        let $ = cheerio.load(xml);
        let body = $("en-note");
        // 判断是否是 md 笔记，如果是才 load ，不是就直接获取内容
        // console.log(body);
        // ok 能够正常获取到
        // console.log(body);
        let len = body['0'].children.length;
        let note = body['0'].children[len-1];
        // console.log(note);
        if(note.name === 'var') {
            return note.children[0].data;
        }
        return undefined;
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
        }
        return {tagNames, source} 
    },
    // 判断命令行参数笔记是否存在
    noteExists(title) {
        // 先判断是否存在
        // 获取笔记本和笔记名
        let notebookName = '我的第一个笔记本';
        let noteName = title;
        if(title.indexOf('/') > -1) {
          // 如果存在 / ，就表示要放到指定笔记本内，如果没指定，就是放到默认笔记本里面
          let _ary = title.split('/');
          notebookName = _ary[0];
          noteName = _ary[1];
        }
        // console.log(notebookName, noteName);
        if(!fs.existsSync(path.join(__dirname, '../note', notebookName, noteName))) {
            // 如果不存在
            return false;
        } else {
            return {
                notebookName,
                noteName
            };
        }
    }
}

