const config = require('./config');
const fs = require('fs');
const path = require('path');

const db = config.db;

let noteStore = config.noteStore;
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

function createNotebookDir(notebook) {
	// 根据笔记本创建文件夹
	const dir = path.join(__dirname, '../note', notebook.name)
	// if(fs.existsSync(dir)) {
	// 	console.log(notebook.name, '已经存在');
	// 	continue;
	// }
	try {
		fs.mkdirSync(dir);
		console.log(notebook.name, '创建成功');
	}catch(err) {
		console.log(err);
	}
}

function fetchNotebookList() {
	fetchNotebooks()
		.then(notebooks => {
			// 判断是否已经存在于数据库内
			for(let i = 0, len = notebooks.length; i < len; i++) {
				const notebook = notebooks[i];
				const result = db.get('notebooks').find({guid: notebook.guid}).value();
				if(result) {
					// 如果这个笔记本已经存在了
					console.log(notebook.name, '已经存在');
					continue;
				}
				// 写入数据库
				let oldNotebook = db.getState('notebooks').notebooks;
				let newNotebook = oldNotebook.push(notebook);
				// console.log(oldNotebook);
				db.setState({
					notebooks
				});
				createNotebookDir(notebook);
			}
		})
		.catch(err => {
			console.log(err);
		})
}

module.exports = fetchNotebookList;