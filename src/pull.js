// 从印象笔记下载指定笔记
const Evernote = require('./Evernote');
const config = require('./config');


const fetchNoteById = require('./fetchNoteById');
const createLocalNote = require('./createLocalNote');

function pull() {
    const localDb = config.getDb();
    Evernote.fetchDb()
        .then(remoteData => {
            // 获取数据库成功后，先比较最后更新时间是否一致
            // console.log(db);
            const localData = localDb.getState();
            const localLastUpdate = localData.lastUpdate;
            const remoteLastUpdate = remoteData.lastUpdate;
            // console.log(localLastUpdate, remoteLastUpdate);
            if(localLastUpdate === remoteLastUpdate) {
                // 如果本地最后更新时间与远程最后更新时间一致，就表示并没有新的笔记或者更新
                console.log('没有新内容');
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
                    _ary.push(fetchNoteById(note.guid));
                }
                // 在 for 循环结束后，
                return Promise.all(_ary);
            }
        })
        .catch(err => {
            console.log(`读取数据库失败 ${err}`);
        })
        .then(notes => {
            let _ary = notes.map(note => {
                return createLocalNote(note);
            })
            return Promise.all(_ary);
        }, err => {
            console.log(`获取笔记详情失败 ${err}`);
        })
        .then(res => {
            // 笔记都创建成功了，更新本地的 lastUpdated
            localDb.get('lastUpdate').assign(remoteLastUpdate).value();
            console.log(`笔记更新完毕 ！`);
        }, err => {
            console.log(err);
        })
}

module.exports = pull;