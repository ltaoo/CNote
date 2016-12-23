// 从印象笔记获取数据库
const config = require('./config');
const db = config.db;

const fs = require('fs');

let noteStore = config.noteStore;
const rootDir = config.root;
const dbName = config.dbName;

const lib = require('./lib');


function fetchDb() {
    return new Promise((resolve, reject) => {
        const guid = db.getState().db;
        // console.log(guid);
        noteStore.getNote(guid, true, false, false, false)
            .then(res => {
                // console.log(res);
                // fs.writeFileSync(path.join(rootDir, dbName), 'utf8');
                // console.log('数据库获取成功');
                let db = res.content;
                db = lib.parseDb(db);
                // console.log(db)
                resolve(JSON.parse(db));
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = fetchDb;
