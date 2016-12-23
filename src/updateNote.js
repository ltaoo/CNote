const config = require('./config');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();

const juice = require('juice');

const lib = require('./lib');
const db = config.db;

let noteStore = config.noteStore;

// 更新笔记
function _updateNote(note) {
    return new Promise((resolve, reject) => {
        const {
            guid,
            noteTitle,
            noteBody,
            parentNotebook,
            created,
            tagNames
        } = note;
        // console.log(guid)
        let nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
        nBody += "<en-note>" + noteBody + "</en-note>";
        // Create note object
        // let ourNote = new Evernote.Note();
        let ourNote = {};
        ourNote.title = noteTitle;
        ourNote.content = nBody;
        // 创建时间
        ourNote.created = created || new Date().getTime();
        // 标签
        ourNote.tagNames = tagNames;
        // guid
        ourNote.guid = guid;
        // parentNotebook is optional; if omitted, default notebook is used
        if (parentNotebook && parentNotebook.guid) {
            ourNote.notebookGuid = parentNotebook.guid;
        }

        // Attempt to create note in Evernote account
        noteStore.updateNote(ourNote)
            .then(note => {
                // console.log(note);
                resolve(note);
            })
            .catch(err => {
                reject(err);
            })
    })
}

function updateNote(title) {
    let _result = lib.noteExists(title);
    if (!_result) {
        // 如果笔记不存在
        console.log(title, '不存在');
        return;
    }
    const {
        notebookName,
        noteName
    } = _result;
    // 判断是否存在于数据库中，如果不存在，就是创建
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

    // 如果存在同名笔记，但不是同一文件夹下的
    let _notebook = db.get('notebooks')
        .find({
            guid: _note.notebookGuid
        })
        .value();
    if(_notebook.name !== notebookName) {
        // 如果笔记本和笔记对不上
        console.log(`${noteName} 不在数据库中，请使用 create <file> 创建`);
        return;
    }

    // 该笔记确确实实是已经存在的，是进行更新操作的笔记。
    // 获取到内容
    let source = fs.readFileSync(path.join(__dirname, '../note', notebookName, noteName), 'utf8');
    // console.log(source);
    // 解析 标签
    let result = lib.getTags(source, md);
    // console.log(result);
    // 渲染 markdown
    let html = md.render(result.source);
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
                .find({guid: note.guid})
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
            console.log(`笔记 “${note.title}” 更新成功`);
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