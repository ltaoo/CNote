const config = require('./config');
const fs = require('fs');
const path = require('path');

let noteStore = config.noteStore;

// 创建笔记本函数
function makeNotebook(noteStore, title) {
  let ourNotebook = {};
  ourNotebook.name = title;

  noteStore.createNotebook(ourNotebook)
    .then(ourNotebook => {
      console.log(ourNotebook);
      console.log('笔记本创建成功');
    })
    .catch(err => {
      console.log('创建失败', err);
    })
}

// makeNotebook(noteStore, 'Nodejs');