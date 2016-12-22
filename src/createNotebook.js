const config = require('./config');
const fs = require('fs');
const path = require('path');

let noteStore = config.noteStore;
const db = config.db;

// 创建笔记本函数
function makeNotebook(title) {
  return new Promise((resolve, reject) => {
    let ourNotebook = {};
    ourNotebook.name = title;

    noteStore.createNotebook(ourNotebook)
      .then(notebook => {
        db.get('notebooks')
          .push(Object.assign({}, {
            // 笔记本唯一 id
            "guid": notebook.guid,
            // 笔记本名
            "name": notebook.name,
            // 是否是默认笔记本
            "defaultNotebook": notebook.defaultNotebook,
            // 笔记本创建时间？
            "serviceCreated": notebook.serviceCreated,
            // 服务端更新时间？
            "serviceUpdated": notebook.serviceUpdated
          }))
          .value();
        resolve(notebook);
      })
      .catch(err => {
        // console.log(err)
        reject('笔记本创建失败，请检查是否已经存在', err);
      })
  })
}

// makeNotebook(noteStore, 'Nodejs');
module.exports = makeNotebook;