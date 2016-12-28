import fs from 'fs';
import path from 'path';

import lib from './lib';
import config from './config';
import updateDb from './updateDb';

// 将本地笔记上传到云端接口，创建笔记本函数
import {
  createNote,
  createNotebook
} from './api';

function _noteExists (title) {
  const db = config.getDb();
  // 先判断是否存在
  // 获取笔记本和笔记名
  let defaultNotebookName = db.get('defaultNotebook').value();
  let notebookName = defaultNotebookName;
  let noteName = title;
  if (title.indexOf('/') > -1) {
    // 如果存在 / ，就表示要放到指定笔记本内，如果没指定，就是放到默认笔记本里面
    let _ary = title.split('/');
    if (_ary.length > 2) {
      // 如果切分出的路径超过两个，就表示有问题
      return false;
    }
    notebookName = _ary[0];
    noteName = _ary[1];
  }
  return {
    notebookName,
    noteName
  };
}

// 获取内容并渲染
function _getHtml({notebookName, noteName}) {
  // 获取到内容
  let source = fs.readFileSync(path.join(notebookName, noteName), 'utf8');
  // console.log(source);
  // 获取到标签，并将 @[] 语法从 md 文件中删除
  let result = lib.getTags(source);
  // 这样渲染出来的 html 就不会包含 @[]
  const content = lib.renderHtml(result.source, source);
  return {tagNames: result.tagNames, content};
}

function _uploadNotebook(notebookName) {
  const db = config.getDb();
  return new Promise((resolve, reject) => {
      createNotebook(notebookName)
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
          reject(err);
        })
  })
}

function _createNote({noteName, content, tagNames, parentNotebook}) {
  const db = config.getDb();
  return new Promise((resolve, reject) => {
    createNote({
      noteTitle: noteName.trim(),
      noteBody: content,
      tagNames,
      parentNotebook
    })
    .then(note => {
      console.log(`笔记 <${note.title}> 创建成功`);
      db.get('notes')
        .push({
          guid: note.guid,
          title: note.title,
          // content: note.content,
          notebookGuid: note.notebookGuid,
          created: note.created,
          updated: note.updated,
          deleted: note.deleted,
          tagGuids: note.tagGuids,
          notebookName: parentNotebook.name
        })
        .value();
      resolve(note);
    })
    .catch(err => {
      console.log('err', 'hello');
      reject(err);
    })
  })
}

// 按照单一原则模式，进行拆分
async function uploadNote(title) {
  let _result = _noteExists(title);
  if(!_result) {
    // 如果笔记不存在
    console.log('请确认路径无误');
    return;
  }
  const {notebookName, noteName} = _result;
  // _result = null;
  const db = config.getDb();
  // 路径无误，检查文件是否存在
  if (!fs.existsSync(path.join(notebookName, noteName))) {
    // 如果不存在
    console.log(`${notebookName}/${title} 不存在`);
    return;
  }
  const {content, tagNames} = _getHtml({notebookName, noteName});
  // 然后就可以新建笔记了
  // 先判断笔记本是否已经在印象笔记中存在
  let _notebook = db.get('notebooks').find({
    name: notebookName
  }).value();

  // console.log(notebook);
  if (!_notebook) {
    // 如果是新笔记本，就要先创建笔记本
    try {
      let result = await _uploadNotebook(notebookName);
      _notebook = result;
      // console.log(notebookName, result, _notebook);
      console.log(`笔记本 《${notebookName}》 创建成功`);
    }catch(err) {
      console.log(err);
    }
  }


  try {
    let result = await _createNote({
      noteName, 
      content, 
      tagNames, 
      parentNotebook: _notebook
    });
    updateDb();
  }catch(err) {
    console.log(err);
  }

}

// 导出
export default uploadNote;