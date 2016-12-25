// 创建本地 md 笔记文件
const fs = require('fs');
const path = require('path');
const config = require('./config');
const lib = require('./lib');

function createLocalNote(note) {
    console.log('hello');
    const db = config.getDb();
    const dbName = config.getDbName();
    // 获取笔记内容
    // console.log(note);
    const content = lib.getContent(note.content);
    console.log(content);
    // 笔记标题
    const title = note.title;
    const notebook = db.get('notebooks').find({guid: note.notebookGuid}).value();
    try {
        // console.log(notebook.name, title, content);
        fs.writeFileSync(path.join(notebook.name, title), content, 'utf8');
        // 更新本地数据
        // 如果已经存在，就是更新
        if(db.get('notes').find({guid: note.guid}).value()) {
            // 
            db.get('notes').find({guid: note.guid}).assign({
               guid: note.guid,
                title: note.title,
                // content: note.content,
                notebookGuid: note.notebookGuid,
                created: note.created,
                updated: note.updated,
                deleted: note.deleted,
                tagGuids: note.tagGuids,
                // path: `${notebook.name}/${title}`,
                notebookName: notebook.name 
            }).value();
            console.log(`笔记 <${title}> 更新成功`);
        } else {
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
                    // path: `${notebook.name}/${title}`,
                    notebookName: notebook.name
                })
                .value();
            console.log(`笔记 <${title}> 创建成功`);
        }
        return true;
    }catch(err) {
        console.log(`笔记 <${title}> 创建失败`);
        return false;
    }
}

module.exports = createLocalNote;