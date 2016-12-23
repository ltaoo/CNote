// 同步数据库至印象笔记
const config = require('./config');
const fs = require('fs');
const path = require('path');
const lib = require('./lib');
const db = config.db;

let noteStore = config.noteStore;
const creatNotebook = require('./createNotebook');

//

function searchNote(obj) {
	const {name} = obj;
	// 先判断印象笔记是否存在
	noteStore.findNotesMetadata({
        words: name
    }, 0, 10, {includeTitle: true})
    .then(res => {
    	console.log(res);
    })
    .catch(err => {
    	console.log(err);
    })
}

searchNote({
	name: 'db.json'
})