const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

const juice = require('juice');

module.exports = {
    getOption() {
        const db = config.getDb();
        const DB_NAME = config.getDbName();
        const APP_NAME = config.getAppName();
        const noteStore = config.getNoteStore();
        return {
            db,
            DB_NAME,
            APP_NAME,
            noteStore
        };
    },
    // 从印象笔记获取实时更新的数据库
    parseDb(xml) {
        let $ = cheerio.load(xml);
        let body = $("en-note");
        // console.log(body);
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
        // console.log(body['0'].children);
        let note = body['0'].children[len - 1];
        // console.log(note);
        if (note.name === 'var') {
            return note.children[0] ?note.children[0].data : '';
        } else {
            // 就不是使用这个命令行工具创建的笔记，那要怎么办呢？
            return undefined;
        }
    },
    getTags(source) {
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
            let reg = new RegExp('@\\[(.+?)\\]', "g");
            source = source.replace(reg, '');
        }
        return {
            tagNames,
            source
        }
    },
    // 判断命令行参数笔记是否存在
    noteExists(title) {
        const db = config.getDb();
        // 先判断是否存在
        // 获取笔记本和笔记名
        let notebookName = db.get('defaultNotebook').value();
        let noteName = title;
        if (title.indexOf('/') > -1) {
            // 如果存在 / ，就表示要放到指定笔记本内，如果没指定，就是放到默认笔记本里面
            let _ary = title.split('/');
            if (_ary.length > 2) {
                // 如果切分除了超过两个，就表示有问题
                console.log('请确认路径无误');
                return false;
            }
            notebookName = _ary[0];
            noteName = _ary[1];
        }
        // console.log(notebookName, noteName);
        if (!fs.existsSync(path.join(notebookName, noteName))) {
            // 如果不存在
            console.log(`${notebookName}/${title} 不存在`);
            return false;
        }
        return true;
    },

    // 渲染 html
    renderHtml(sourceWithoutTag, source) {
        // console.log(result);
        // 渲染 markdown
        let html = md.render(sourceWithoutTag);
        html += `<var>${source}</var>`;
        // console.log(html);
        // 读取样式
        let style = fs.readFileSync(path.join(__dirname, './themes', 'github_markdown.css'), 'utf8');
        // 插入行内样式
        let content = juice.inlineContent(html, style);

        return content;
    }
}