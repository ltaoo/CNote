const config = require('./config');
const fs = require('fs');
const path = require('path');

let noteStore = config.noteStore;
const db = config.db;

// 获取笔记列表
function fetchNote() {
	const result = db.getState('notebooks');
	// console.log(result);
	const _ary = result.notebooks.map(notebook => {
		// findNoteMetadata 返回的是一个 promise 实例
		return noteStore.findNotesMetadata({
			notebookGuid: notebook.guid
		}, 0, 0, {
			includeTitle: true,
			includeContentLength: true,
			includeCreated: true,
			// includeUpdated: true,
			// includeDeleted: true,
			// includeUpdateSequenceNum: true,
			includeNotebookGuid: true,
			includeTagGuids: true,
			includeAttributes: true,
			// includeLargestResourceMime: true,
			// includeLargestResourceSize: true
		})
	})

	Promise.all(_ary)
		.then(res => {
			// console.log(res);
			// 拿到了保存每一个笔记本内笔记相关的详细信息，需要用到totalNotes
			let notes = [];
			for(let i = 0, len = res.length; i < len; i++) {
				const metadata = res[i];
				if(metadata.totalNotes === 0) {
					// 如果笔记本内没有笔记，就跳过
					continue;
				}

				// 不然就读取这个笔记本里面的笔记列表
				notes.push()
			}
		})
		.catch(err => {
			console.log(err);
		})
}

fetchNote();