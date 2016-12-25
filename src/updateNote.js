const config = require('./config');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();

const juice = require('juice');

const lib = require('./lib');
const updateDb = require('./updateDb');


const _updateNote = require('./api').updateNote;

function updateNote(title) {
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
            return;
        }
        notebookName = _ary[0];
        noteName = _ary[1];
    }
    // console.log(notebookName, noteName);
    if (!fs.existsSync(path.join(notebookName, noteName))) {
        // 如果不存在
        console.log(`${notebookName}/${title} 不存在`);
        return;
    }
    // 判断是否存在于数据库中，如果不存在，就是创建
    // console.log(noteName);
    let _note = db.get('notes')
        .find({
            title: noteName
        })
        .value();

    if (!_note) {
        // 如果笔记不存在
        console.log('该笔记为新笔记，请使用 create <file> 创建');
        return;
    }

    // console.log(notebookName, noteName);
    // 如果存在同名笔记，但不是同一文件夹下的
    let _notebook = db.get('notebooks')
        .find({
            guid: _note.notebookGuid
        })
        .value();
    if (_notebook.name !== notebookName) {
        // 如果笔记本和笔记对不上
        console.log(`${noteName} 不在数据库中，请使用 create <file> 创建`);
        return;
    }

    // 该笔记确确实实是已经存在的，是进行更新操作的笔记。
    // 获取到内容
    console.log(notebookName, noteName);
    let source = fs.readFileSync(path.join(notebookName, noteName), 'utf8');
    // console.log(source);
    // 解析 标签
    let result = lib.getTags(source, md);
    // console.log(result);
    // 渲染 markdown
    let html = md.render(result.source);
    html += `<var>${source}</var>`;
    // 读取样式
    let style = fs.readFileSync(path.join(__dirname, './themes', 'github_markdown.css'), 'utf8');
    // 插入行内样式
    let content = juice.inlineContent(html, style);
    // console.log(content);
    // return;
    // 然后就可以更新笔记了
    // console.log(_note.guid);
    _updateNote({
            guid: _note.guid,
            noteTitle: noteName.trim(),
            noteBody: content,
            tagNames: result.tagNames,
            parentNotebook: _notebook
        })
        .then(note => {
            db.get('notes')
                .find({
                    guid: note.guid
                })
                .assign({
                    guid: note.guid,
                    title: note.title,
                    // content: note.content,
                    notebookGuid: note.notebookGuid,
                    created: note.created,
                    updated: note.updated,
                    // deleted: note.deleted,
                    tagGuids: note.tagGuids
                })
                .value();
            console.log(`笔记 <${note.title}> 更新成功`);
            updateDb();
        })
        .catch(err => {
            console.log(err);
        })
}

// 导出
module.exports = updateNote;


/*
    问题
    无法实现笔记重命名、笔记移动到其他文件夹，因为依赖笔记本名和笔记名来提交。只能 push 全部的替换现有的。
*/