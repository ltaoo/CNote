const fs = require('fs');
const Evernote = require('./Evernote');
const config = require('./config');
const fetchNoteById = require('./api').fetchNoteById;
const searchNote = require('./api').searchNote;
const lib = require('./lib');
// 如果是初始化，表示是重新来，所以先将所有文件删除掉，包括数据库。
// delete all file
function clone() {
    return new Promise((resolve, reject) => {
        const DB_NAME = config.getDbName();
        Evernote.createLocalNotebooks()
            .then(() => {
                // 如果笔记本对应的文件夹都创建好了，就可以去获取笔记了
                return Evernote.createLocalNotes();
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                // return Promise.reject('err');
                reject(`1 - ${err}`);
            })
            .then(res => {
                // 获取完笔记本、笔记后，再看看数据库文件是否存在
                return searchNote({name: DB_NAME});
            })
            .catch(err => {
                // console.log(`2 - ${JSON.stringify(err)}`);
                // 数据库文件不存在？似乎有点问题啊
                reject(`2 - ${JSON.stringify(err)}`);
            })
            .then(res => {
                let exists = false;
                if(res.totalNotes > 0) {
                    // 如果搜索到该关键字
                    res.notes.forEach(note => {
                        //
                        if(note.title === DB_NAME) {
                            // 并且笔记标题是 db.json ，那就肯定是数据库了
                            exists = note;
                        }
                    })
                }

                if(exists) {
                    // 如果确实存在，那就下载下来覆盖已有的
                    // console.log(`exists${exists}`);
                    return fetchNoteById(exists.guid);
                } else {
                    reject(`5 - `);
                }
            })
            .catch(err => {
                // console.log(`3 - ${err}`);
                reject(`3 - ${err}`);
            })
            .then(note => {
                // console.log(`note ${JSON.stringify(note)}`);
                let content = lib.parseDb(note.content);

                // console.log(`content ${content}`);
                fs.writeFileSync(DB_NAME, content, 'utf8');

                resolve(`clone 成功`);
            })
            .catch(err => {
                // console.log(`4 - ${err}`);
                reject(`4 - ${err}`);
            })
    })
}

module.exports = clone;