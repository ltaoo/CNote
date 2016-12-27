// 创建本地 md 笔记文件
import fs from 'fs';
import path from 'path';
import config from './config';
import lib from './lib';

function createLocalNote(note) {
    const db = config.getDb();
    const dbName = config.getDbName();
    // 获取笔记内容
    const content = lib.getContent(note.content);
    console.log(content);
    // 笔记标题
    const title = note.title;
    // 对应的笔记本对象
    const notebook = db.get('notebooks').find({guid: note.notebookGuid}).value();
    try {
        // 创建本地 md 文件。
        fs.writeFileSync(path.join(notebook.name, title), content, 'utf8');
        // 更新本地数据
    }catch(err) {
        console.log(`笔记 <${title}> 创建失败`);
        return false;
    }
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
}

export default createLocalNote;
