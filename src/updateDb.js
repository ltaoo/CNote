// 同步数据库至印象笔记
const config = require('./config');
const fs = require('fs');
const path = require('path');
const lib = require('./lib');
const db = config.db;

let noteStore = config.noteStore;
const creatNotebook = require('./createNotebook');
const searchNote = require('./searchNote');

//

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
					exists = true;
				}
			})
		}

		// 根据是否存在来处理
	})
}