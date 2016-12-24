const config = require('./config');
// 工具方法
const lib = require('./lib');

const fetchNotes = require('./api').fetchNotes;
const createLocalNote = require('./createLocalNote');


function createLocalNotes() {
    const db = config.getDb();
    const noteStore = config.getNoteStore();
    return new Promise((resolve, reject) => {
        // 从云端获取笔记列表
        fetchNotes()
            .then(notes => {
                // 获取笔记列表成功，读取内容并生成 md 文件
                let ary = notes.map(note => {
                  return noteStore.getNote(note.guid, true, false, false, false);
                })
                return Promise.all(ary);
            })
            .then(notes => {
                // 获取笔记内容成功，然后可以生成对应的文件了
                let _ary = notes.map(note => {
                    // 详细笔记
                    return createLocalNote(note);
                });

                return Promise.all(_ary);
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = createLocalNotes;