// 同步数据库至印象笔记
const config = require('./config');
const fs = require('fs');

const createNote = require('./api').createNote;
const updateNote = require('./api').updateNote;
const searchNote = require('./api').searchNote;

function updateDb() {
    const db = config.getDb();
    const DB_NAME = config.getDbName();
    const APP_NAME = config.getAppName();
    let noteStore = config.getNoteStore();
    let data = db.set('lastUpdate', new Date().getTime()).value();
    // console.log(data);
    let content = fs.readFileSync(DB_NAME, 'utf8');
    // console.log(JSON.parse(content));
    // 先判断印象笔记是否存在数据库文件
    searchNote({
            name: DB_NAME
        })
        .then(result => {
            updateNote({
                    guid: result.notes[0].guid,
                    noteTitle: DB_NAME,
                    noteBody: content
                })
                .then(res => {
                    console.log(`更新数据成功`);
                })
                .catch(err => {
                    console.log(`更新数据失败 ${JSON.stringify(err)}`);
                })
        })
        .catch(err => {
            // console.log(`查询数据失败 ${err}`);
            // 如果在云端不存在数据库，没关系啊
            if (err === '搜索结果为空') {

                // let content = fs.readFileSync(DB_NAME, 'utf8');
                createNote({
                        noteTitle: DB_NAME,
                        noteBody: content,
                        attributes: {
                            contentClass: APP_NAME
                        }
                    })
                    .then(res => {
                        if (!db.has('db').value()) {
                            // 如果本地数据库不存在
                            db.set('db', res.guid).value();
                            updateDb();
                        }
                        console.log(`上传数据成功`);
                    })
                    .catch(err => {
                        console.log(`上传数据失败 ${JSON.parse(err)}`);
                    })
            } else {
                console.log('未知错误 ~');
            }

        })
}

module.exports = updateDb;