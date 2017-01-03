import fs from 'fs';
import path from 'path';

import config from './config';
import {createNotebook} from './api';

// 创建笔记本函数
function uploadNotebook(title) {
  return new Promise((resolve, reject) => {
    const noteStore = config.getNoteStore();
    const db = config.getDb();
    // 先判断是否存在吧？
    if(db.get('notebooks').find({name: title}).value()) {
      // 已经存在
      reject(`笔记本《${title}》创建失败，已经存在`);
    }
    createNotebook(title)
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
        reject(`笔记本《${title}》创建失败 ${JSON.stringify(err)}`);
      })
  })
}

// makeNotebook(noteStore, 'Nodejs');
export default uploadNotebook;
