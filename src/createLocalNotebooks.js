import config from './config';
import {
	fetchNotebooks
} from './api';
import createLocalNotebook from './createLocalNotebook';

async function createNotebooks() {
	const db = config.getDb();
	// 1、从云端获取到笔记本列表
	let notebooks = await fetchNotebooks();
	// console.log(notebooks);
	// 2、判断云端的笔记本是否已经存在于数据库内
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

	console.log('\n===== 全部笔记本生成 =====\n');
}

export default createNotebooks;
