// 创建本地 md 笔记文件
const fs = require('fs');
const path = require('path');
const config = require('./config');
const lib = require('./lib');
// 数据库
const db = config.db;
// 笔记根目录
const rootDir = config.root;
// 
const createLocalNotebook = require('./createLocalNotebook');


function createLocalNote(note) {
    // 获取笔记内容
    const content = lib.getContent(note.content);
    // 笔记标题
    const title = note.title;
    // 笔记本
    const notebook = db.get('notebooks').find({guid: note.notebookGuid}).value();
    // console.log(notebook.name);
    try {
        fs.writeFileSync(rootDir, notebook.name, title), content, 'utf8');
        // 更新本地数据
        db.get('notes')
            .find({guid: note.guid})
            .assign({
                guid: note.guid,
                title: note.title,
                content: note.content,
                notebookGuid: note.notebookGuid,
                created: note.created,
                updated: note.updated,
                deleted: note.deleted,
                tagGuids: note.tagGuids
            })
            .value();
        console.log('笔记', note.title, '创建成功');
    }catch(err) {
        console.log('生成笔记', note.title, '失败', err);
    }
}

module.exports = createLocalNote;