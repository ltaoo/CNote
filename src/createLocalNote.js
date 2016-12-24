// 创建本地 md 笔记文件
const fs = require('fs');
const path = require('path');
const config = require('./config');
const lib = require('./lib');
// 数据库
// 
const createLocalNotebook = require('./createLocalNotebook');


function createLocalNote(note) {
    const db = config.getDb();
    return new Promise((resolve, reject) => {
        // 获取笔记内容
        // console.log(note);
        const content = lib.getContent(note.content);
        // 笔记标题
        const title = note.title;
        const notebook = db.get('notebooks').find({guid: note.notebookGuid}).value();
        fs.writeFile(path.join(notebook.name, title), content, 'utf8', (err, res) => {
            if(err) reject(`笔记 <${title}> 创建失败`);
            // 更新本地数据
            db.get('notes')
                .push({
                    guid: note.guid,
                    title: note.title,
                    // content: note.content,
                    notebookGuid: note.notebookGuid,
                    created: note.created,
                    updated: note.updated,
                    deleted: note.deleted,
                    tagGuids: note.tagGuids,
                    path: `${notebook.name}/${title}`,
                    notebookName: notebook.name
                })
                .value();
            resolve(`笔记 <${title}> 创建成功`);
        });
    })
}

module.exports = createLocalNote;