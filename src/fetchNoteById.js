const config = require('./config');

// 根据 guid 获取笔记
function fetchNoteById(guid) {
    const noteStore = config.getNoteStore();
    return new Promise((resolve, reject) => {
        noteStore.getNote(guid, true, false, false, false)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
}


module.exports = fetchNoteById;