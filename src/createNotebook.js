const config = require('./config');
const fs = require('fs');
const path = require('path');

let noteStore = config.noteStore;

// 创建笔记本函数
function makeNotebook(title) {
  return new Promise((resolve, reject) => {
    let ourNotebook = {};
    ourNotebook.name = title;

    noteStore.createNotebook(ourNotebook)
      .then(ourNotebook => {
        resolve('笔记本创建成功');
      })
      .catch(err => {
        // console.log(err)
        reject('笔记本创建失败，请检查是否已经存在', err);
      })
  })
}

// makeNotebook(noteStore, 'Nodejs');
module.exports = makeNotebook;