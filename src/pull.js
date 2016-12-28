// 从印象笔记下载指定笔记
import low from 'lowdb';

import config from './config';
import createLocalNotebook from './createLocalNotebook';
import createLocalNote from './createLocalNote';
import uploadNotebook from './uploadNotebook';

import {
    fetchNoteById
} from './api';
// 获取数据库
import fetchDb from './fetchDb';


// 获取远端的最后更新时间
async function fetchLastUpdate() {
    try {
        // 获取云端的数据库全部数据
        let remoteData = await fetchDb();
        return remoteData;
    }catch(err) {
        throw new Error(err);
    }
}

// 比较云端和本地数据库差异，返回有更新的笔记
async function _compareNote(remoteData) {
    try {
        const localDb = config.getDb();
        // 获取本地的数据库全部数据
        const localData = localDb.getState();
        // 获取数据库成功后，再获取到各自的最后更新时间
        // 本地数据库的最后一次更新时间
        const localLastUpdate = localData.lastUpdate;

        // 云端数据库的最后一次更新时间
        const remoteLastUpdate = remoteData.lastUpdate;
        let _ary = [];
        // 再比较最后更新时间是否一致
        if(localLastUpdate === remoteLastUpdate) {
            // 如果本地最后更新时间与云端最后更新时间一致，就表示并没有新的笔记或者更新
            console.log('没有新内容');
        } else {
            // 反之就是有了，那就要一一比对？如果笔记数量很多岂不是性能很有问题？
            // 往往是远端的笔记列表会更多，所以遍历远端的
            for(let i = 0, len = remoteData.notes.length; i < len; i++) {
                let remoteNote = remoteData.notes[i];
                let localNote = localDb.get('notes').find({guid: remoteNote.guid}).value();

                if(localNote && localNote.updated === remoteNote.updated) {
                    // 如果本地数据库这篇笔记存在且时间一致，就表示这篇笔记没有更新
                    // 可以跳过
                    continue;
                }

                // 更新或者新增的笔记，获取笔记详情
                let result = await fetchNoteById(remoteNote.guid, remoteNote.notebookName);
                // console.log(result);
                _ary.push(result);
            }
        }
        // console.log('fanhui', _ary);
        return _ary;
    }catch(err) {
        throw new Error(err);
    }
}


// 获取云端数据库对应字段
function _getNotebook(remoteData, guid) {
    let notebooks = remoteData.notebooks;
    let _notebook = null;
    notebooks.forEach(notebook => {
        if(notebook.guid === guid) {
            _notebook = notebook;
        }
    })

    return _notebook;
}

async function pull() {
    const localDb = config.getDb();
    // 云端数据库的最后一次更新时间
    const remoteData = await fetchLastUpdate();
    // 云端数据库的最后一次更新时间
    const remoteLastUpdate = remoteData.lastUpdate;
    try {
        // 获取这次 pull 操作新增或者更新的笔记详情
        let notes = await _compareNote(remoteData);
        // console.log(notes);
        notes.forEach(note => {
            // 获取到这篇笔记的笔记本
            let notebook = localDb.get('notebooks').find({guid: note.notebookGuid}).value();
            if(!notebook) {
                // 如果笔记本没有创建，就先创建笔记本
                // 获取到云端的数据库对应的字段

                createLocalNotebook(_getNotebook(remoteData, note.notebookGuid));
            }
            // 再创建笔记
            createLocalNote(note);
        })

    }catch(err) {
        console.log(err);
    }
    // 笔记都创建成功了，更新本地的 lastUpdated
    localDb.set('lastUpdate', remoteLastUpdate).value();
}

module.exports = pull;