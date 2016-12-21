const fs = require('fs');
const path = require('path');
const client = require('./config');

let noteStore = client.getNoteStore();
// 获取笔记本列表
function fetchNotebooks() {
	return new Promise((resolve, reject) => {
		noteStore.listNotebooks()
			// 获取笔记本列表成功
			.then(function(notebooks) {
				// notebooks is the list of Notebook objects
				// console.log(notebooks);
				resolve(notebooks);
			})
			.catch(err => {
				reject('获取笔记本列表失败', err);
			});
	})
}

function createNotebookDir(notebooks) {
	// 根据笔记本创建文件夹
	for(let i = 0, len = notebooks.length; i < len; i++) {
		const notebook = notebooks[i];
		const dir = path.join(__dirname, '../note', notebook.name)
		if(fs.existsSync(dir)) {
			console.log(notebook.name, '已经存在');
			continue;
		}
		try {
			fs.mkdirSync(dir);
			console.log(notebook, '创建成功');
		}catch(err) {
			console.log(err);
		}
	}
}

function fetchNotebookList() {
	fetchNotebooks()
		.then(notebooks => {
			createNotebookDir(notebooks);
		})
		.catch(err => {
			console.log(err);
		})
}

module.exports = fetchNotebookList;