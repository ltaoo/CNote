const config = require('./config');
// 工具方法
const lib = require('./lib');

const fetchNotes = require('./api').fetchNotes;
const createLocalNote = require('./createLocalNote');


function createLocalNotes() {
    const db = config.getDb();
    const dbName = config.getDbName();
    const noteStore = config.getNoteStore();
    return new Promise((resolve, reject) => {
        // 从云端获取笔记列表
        fetchNotes()
            .then(notes => {
                // 获取笔记列表成功，读取内容并生成 md 文件
                let ary = notes.filter(note => {
                    // console.log(note.guid);
                    if(note.title !== dbName) {
                        return note;
                    }
                })
                ary = ary.map(note => {
                    return noteStore.getNote(note.guid, true, false, false, false);
                })
                // console.log(ary);
                return Promise.all(ary);
            })
            // .catch(err => {
            //     reject(`获取笔记列表失败 - ${JSON.stringify(err)}`);
            // })
            .then(notes => {
                // 获取笔记内容成功，然后可以生成对应的文件了
                notes.forEach(note => {
                    // console.log(note);
                    // 详细笔记
                    let result = createLocalNote(note);
                    // console.log(result);
                });

                // console.log(_ary);
                // return Promise.all(_ary);
                resolve('所有笔记创建成功');
            })
            // .catch(err => {
            //     console.log('23123123123213213123123');
            //     reject(`创建笔记文件失败 - ${JSON.stringify(err)}`);
            // })
            // .then(res => {
            //     console.log('所有笔记创建成功');
            //     resolve('所有笔记创建成功');
            // })
            .catch(err => {
                reject(`创建笔记文件失败 - ${JSON.stringify(err)}`);
            })
    })
}

module.exports = createLocalNotes;