const config = require('./config');

const fetchNotebooks = require('./api').fetchNotebooks;
const createLocalNotebook = require('./createLocalNotebook');

function createNotebooks() {
	const db = config.getDb();
	return new Promise((resolve, reject) => {
		fetchNotebooks()
			.then(notebooks => {
				let ary = [];
				// 判断云端的笔记本是否已经存在于数据库内
				for (let i = 0, len = notebooks.length; i < len; i++) {
					const notebook = notebooks[i];
					const result = db.get('notebooks').find({
						guid: notebook.guid
					}).value();
					if (result) {
						// 如果这个笔记本已经存在了
						console.log(`《${notebook.name}》已经存在`);
						continue;
					}
					if(notebook.defaultNotebook) {
						// 如果这个笔记本是默认笔记本
						db.set('defaultNotebook', notebook.name).value();
					}

					// 最后是生成对应文件夹并写入数据库
					createLocalNotebook(notebook);
				}

				resolve(true);
			})
			.catch(err => {
				reject(`创建笔记本文件夹失败 - ${JSON.stringify(err)}`);
			})
	})
}

module.exports = createNotebooks;
