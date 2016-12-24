// 同步数据库至印象笔记
const config = require('./config');
const fs = require('fs');

const createNote = require('./api').createNote;
const updateNote = require('./api').updateNote;
const searchNote = require('./api').searchNote;

function updateDb() {
    const db = config.getDb();
    let noteStore = config.getNoteStore();
    const DB_NAME = config.getDbName();
    const APP_NAME = config.getAppName();
	// 先判断印象笔记是否存在数据库文件
	searchNote({
		name: DB_NAME
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
        let content = fs.readFileSync(DB_NAME, 'utf8');
		// 根据是否存在来处理
        if(!exists) {
            // 如果不存在，就先上传到印象笔记
            createNote({
                noteTitle: DB_NAME,
                noteBody: content,
                attributes: {
                    contentClass: APP_NAME
                }
            })
            .then(res => {
                if (!db.has('db').value()) {
                  db.set('db', res.guid).value()
                }
                console.log(`更新数据成功`);
            })
            .catch(err => {
                console.log(`更新数据失败 ${err}`);
            })
        } else {
            // 如果已经存在，就是更新
            updateNote({
                guid: exists.guid,
                noteTitle: DB_NAME,
                noteBody: content
            })
            .then(res => {
                console.log(`更新数据成功`);
            })
            .catch(err => {
                console.log(`更新数据失败 ${err}`);
            })
        }
	})
    .catch(err => {
        console.log(`查询数据失败 ${err}`);
    })
}

module.exports = updateDb;