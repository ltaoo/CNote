// 创建本地笔记本文件夹
const fs = require('fs');
const path = require('path');
const config = require('./config');
const lib = require('./lib');
// 数据库
const db = config.db;
// 笔记根目录
const rootDir = config.root;
// 

function createLocalNotebook(notebook) {
    // 笔记本标题
    const title = notebook.name;
    // 判断
    // console.log(notebook.name);
    try {
        fs.mkdirSync(path.join(rootDir, title));
        // 更新本地数据
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
        console.log('笔记本', title, '创建成功');
    }catch(err) {
        console.log('生成笔记本', title, '失败', err);
    }
}

module.exports = createLocalNote;