import config from './config';
// 工具方法
import lib from './lib';

import {
    fetchNotes
} from './api';

import createLocalNote from './createLocalNote';


async function createLocalNotes() {
    const db = config.getDb();
    const dbName = config.getDbName();
    const noteStore = config.getNoteStore();
    try {
        // 从云端获取笔记列表
        let notes = await fetchNotes();
        let ary = notes.filter(note => {
            // console.log(note.guid);
            if(note.title !== dbName) {
                return note;
            }
        });

        let noteDetails = [];
        for(let i = 0, len = ary.length; i < len; i++) {
            let note = ary[i];
            let noteDetail = await noteStore.getNote(note.guid, true, false, false, false);
            noteDetails.push(noteDetail);
        }

        // 获取到由笔记详情组成的数组
        noteDetails.forEach(note => {
            // console.log('开始创建本地文件');
            // 创建本地 md 文件
            createLocalNote(note);
        });
    }catch(err) {
        console.log(err);
    }

    console.log('\n===== 全部笔记生成 =====\n');
}

export default createLocalNotes;