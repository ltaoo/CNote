const config = require('./config');
const fs = require('fs');
const path = require('path');

const db = config.db;

let noteStore = config.noteStore;
// 获取笔记本列表
function _fetchNotebooks() {
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

function _createNotebookDir(notebook) {
	return new Promise((resolve, reject) => {
		// 根据笔记本创建文件夹
		const dir = path.join(__dirname, '../note', notebook.name)
			// if(fs.existsSync(dir)) {
			// 	console.log(notebook.name, '已经存在');
			// 	continue;
			// }
		try {
			fs.mkdirSync(dir);
			resolve(notebook.name, '创建成功');
		} catch (err) {
			reject('笔记创建失败', err);
		}
	})
}

function fetchNotebookList() {
	return new Promise((resolve, reject) => {
		_fetchNotebooks()
			.then(notebooks => {
				let ary = [];
				// 判断是否已经存在于数据库内
				for (let i = 0, len = notebooks.length; i < len; i++) {
					const notebook = notebooks[i];
					const result = db.get('notebooks').find({
						guid: notebook.guid
					}).value();
					if (result) {
						// 如果这个笔记本已经存在了
						console.log(notebook.name, '已经存在');
						continue;
					}
					// 写入数据库
					// 如果表不存在，就初始化
					if (!db.has('notebooks').value()) {
						db.set('notebooks', []).value()
					}
					// let oldNotebook = db.getState('notebooks').notebooks;
					// console.log(oldNotebook);
					// return;
					db.get('notebooks')
						.push(Object.assign({}, {
							// 笔记本唯一 id
							"guid": notebook.guid,
							// 笔记本名
							"name": notebook.name,
							// 是否是默认笔记本
							"defaultNotebook": notebook.defaultNotebook,
							// 笔记本创建时间？
							"serviceCreated": notebook.serviceCreated,
							// 服务端更新时间？
							"serviceUpdated": notebook.serviceUpdated
						}))
						.value();
					ary.push(_createNotebookDir(notebook));
				}
				resolve(Promise.all(ary));
			})
			.catch(err => {
				reject(err);
			})
	})
}

module.exports = fetchNotebookList;

// fetchNotebookList();