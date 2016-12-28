// 同步数据库至印象笔记
import fs from 'fs';

import config from './config';
import {
    createNote,
    updateNote,
    searchNote
} from './api';

// 从配置文件中获取字段
function getConfig (config) {
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
}

const updateDb = async function() {
    const {
        db,
        DB_NAME,
        APP_NAME,
        noteStore
    } = getConfig(config);

    // 写入最后更新时间
    db.set('lastUpdate', new Date().getTime()).value();
    // 读取数据库全部内容
    let content = fs.readFileSync(DB_NAME, 'utf8');
    // 判断印象笔记是否存在数据库文件
    let searchResult;
    try {
        searchResult = await searchNote({name: DB_NAME });
    } catch(err) {
        console.log(err);
    }

    if(searchResult && searchResult.totalNotes !== 0) {
        // 如果搜索到了，且数量不为空，就表示真的是搜索到了！就可以更新笔记了
        let note = await updateNote({
            guid: searchResult.notes[0].guid,
            noteTitle: DB_NAME,
            noteBody: content
        });
        console.log(`更新数据成功`);
    } else {
        // 没有搜索到
        try {
            let note = await createNote({
                noteTitle: DB_NAME,
                noteBody: content,
                attributes: {
                    contentClass: APP_NAME
                }
            });
            console.log(`上传数据成功`);
            // 如果是第一次更新数据
            if (!db.has('db').value()) {
                // 如果本地数据库不存在
                db.set('db', note.guid).value();
                updateDb();
            }
        }catch(err) {
            console.log(`上传数据失败 ${JSON.parse(err)}`);
        }
    }

}
export default updateDb;