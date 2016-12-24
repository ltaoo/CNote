const fs = require('fs');
const path = require('path');

const config = require('./config');
const createNotebook = require('./api').createNotebook;

// 创建笔记本函数
function uploadNotebook(title) {
  const noteStore = config.getNoteStore();
  const db = config.getDb();
  return new Promise((resolve, reject) => {
    lib.createNotebook(title)
      .then(notebook => {
        db.get('notebooks')
          .push({
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
          })
          .value();
        resolve(notebook);
      })
      .catch(err => {
        // console.log(err)
        reject(`笔记本《${title}》创建失败，请检查是否已经存在 ${JSON.stringify(err)}`);
      })
  })
}

// makeNotebook(noteStore, 'Nodejs');
module.exports = uploadNotebook;