// 从印象笔记下载指定笔记
const low = require('lowdb');

const config = require('./config');
const createLocalNotebook = require('./createLocalNotebook');
const createLocalNote = require('./createLocalNote');
const uploadNotebook = require('./uploadNotebook');
const fetchNoteById = require('./api').fetchNoteById;
// 获取数据库
const fetchDb = require('./fetchDb');

function pull() {
    return new Promise((resolve, reject) => {
        const localDb = config.getDb();
        // let remoteDb = null;
        let _remoteData = null;
        let lastUpdate = null;
        fetchDb()
            .then(remoteData => {
                // 获取数据库成功后，先比较最后更新时间是否一致
                // console.log(remoteData);
                const localData = localDb.getState();
                // let _remoteDb = low(remoteData);
                // remoteDb = _remoteDb;
                _remoteData = remoteData;
                const localLastUpdate = localData.lastUpdate;
                const remoteLastUpdate = remoteData.lastUpdate;
                lastUpdate = remoteLastUpdate;
                // console.log(localLastUpdate, remoteLastUpdate);
                if(localLastUpdate === remoteLastUpdate) {
                    // 如果本地最后更新时间与远程最后更新时间一致，就表示并没有新的笔记或者更新
                    reject('没有新内容');
                } else {
                    // 反之就是有了，那就要一一比对？如果笔记数量很多岂不是性能很有问题？
                    // 往往是远端的笔记列表会更多，所以遍历远端的
                    let _ary = [];
                    for(let i = 0, len = remoteData.notes.length; i < len; i++) {
                        let note = remoteData.notes[i];
                        let localNote = localDb.get('notes').find({guid: note.guid}).value();
                        if(localNote && localNote.updated === note.updated) {
                            // 如果笔记存在且时间一致，就可以继续下一循环
                            continue;
                        }
                        // console.log(note.notebookName);
                        let result = fetchNoteById(note.guid, note.notebookName);
                        _ary.push(result);
                    }
                    // 在 for 循环结束后，
                    return Promise.all(_ary);
                }
            })
            // .then(res => {
            //     console.log('获取想')
            // })
            .catch(err => {
                reject(`读取数据库失败 ${JSON.stringify(err)}`);
            })
            .then(notes => {
                // console.log(notes);
                // 这里是获取到笔记详情的 成功处理 函数
                let _ary = notes.forEach(note => {
                    // 看看笔记本有没有创建

                    let notebook = localDb.get('notebooks').find({guid: note.notebookGuid}).value();
                    if(!notebook) {
                        // 如果笔记本没有创建，就先创建笔记本
                        // let notebook = remoteDb.get('notebooks').find({guid: note.notebookGuid}).value();
                        // console.log(typeof _remoteData);
                        // let data = _remoteData;
                        let _notebook = null;
                        _remoteData.notebooks.forEach(notebook => {
                            if(notebook.guid === note.notebookGuid) {
                                _notebook = notebook;
                            }
                        })
                        let result = createLocalNotebook(_notebook);
                        if(!result) {
                            reject('笔记创建失败，中止下载');
                        }
                    }
                    console.log(note);
                    createLocalNote(note);
                })
                // return Promise.all(_ary);
                // 笔记都创建成功了，更新本地的 lastUpdated
                localDb.set('lastUpdate', lastUpdate).value();
                resolve(`笔记更新完毕 ！`);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = pull;