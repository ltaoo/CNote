// 从印象笔记获取数据库
const config = require('./config');

const fs = require('fs');

const lib = require('./lib');


function fetchDb() {
    const db = config.getDb();
    const noteStore = config.getNoteStore();
    return new Promise((resolve, reject) => {
        const guid = db.get('db').value();
        // console.log(guid);
        noteStore.getNote(guid, true, false, false, false)
            .then(res => {
                // console.log(res);
                let data = res.content;
                data = lib.parseDb(data);
                let result = JSON.parse(data);
                // console.log(db)
                // console.log(result);
                resolve(result);
            })
            .catch(err => {
                // console.log(err);
                reject(err);
            })
    })
}

module.exports = fetchDb;
