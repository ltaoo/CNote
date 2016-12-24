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
        const content = lib.getContent(note.content);
        // 笔记标题
        const title = note.title;
        // 笔记本
        const notebook = db.get('notebooks').find({guid: note.notebookGuid}).value();
        // console.log(notebook.name);
        if(!notebook) {
            // 如果笔记本不存在数据库中，表示这是新笔记本中的新笔记
            createLocalNotebook(notebook);
        }
        try {
            fs.writeFileSync(path.join(__dirname, notebook.name, title), content, 'utf8');
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
            resolve(`笔记 <${title}> 创建成功`);
        }catch(err) {
            reject(`笔记 <${title}> 创建失败`);
        }
    })
}

module.exports = createLocalNote;