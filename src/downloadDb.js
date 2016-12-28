import fs from 'fs';
import config from './config';

import {
	searchNote,
	fetchNoteById
} from './api';

import {
	parseDb
} from './lib';

async function downloadDb () {
    const DB_NAME = config.getDbName();
    // 判断数据库是否存在
    let searchResult;
    try {
        searchResult = await searchNote({name: DB_NAME });
	    if(searchResult && searchResult.totalNotes !== 0) {
	        // 如果搜索到了，且数量不为空，就表示真的是搜索到了！就可以下载笔记了
	        let note = await fetchNoteById(searchResult.notes[0].guid);

	        // 然后获取内容
	        let content = parseDb(note.content);
	        // 写入本地
	        // console.log(DB_NAME);
	        fs.writeFileSync(DB_NAME, content, 'utf8');
	    }
    } catch(err) {
        console.log('发生异常', err);
    }

}

export default downloadDb;