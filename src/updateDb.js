// 同步数据库至印象笔记
const config = require('./config');
const fs = require('fs');
const path = require('path');
const lib = require('./lib');
const db = config.db;

let noteStore = config.noteStore;
const creatNotebook = require('./createNotebook');
const searchNote = require('./searchNote');

const rootDir = config.root;
const APP_NAME = config.appName;

const _makeNote = require('./api')._makeNote;
const _updateNote = require('./api')._updateNote;

function updateDb() {
	// 先判断印象笔记是否存在
	searchNote({
		name: 'db.json'
	})
	.then(res => {
		let exists = false;
		if(res.totalNotes > 0) {
			// 如果搜索到该关键字
			res.notes.forEach(note => {
				//
				if(note.title === 'db.json') {
					// 并且笔记标题是 db.json ，那就肯定是数据库了
					exists = note;
				}
			})
		}
        let content = fs.readFileSync(path.join(rootDir, 'db.json'), 'utf8');
		// 根据是否存在来处理
        if(!exists) {
            // 如果不存在，就先上传到印象笔记
            _makeNote({
                noteTitle: 'db.json',
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
            _updateNote({
                guid: exists.guid,
                noteTitle: 'db.json',
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