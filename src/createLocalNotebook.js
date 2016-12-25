// 创建本地笔记本文件夹
const fs = require('fs');
const config = require('./config');

function createLocalNotebook(notebook) {
    // 数据库
    const db = config.getDb();
    // 笔记本标题
    const title = notebook.name;
    // 判断
    try {
        fs.mkdirSync(title);
        // 更新本地数据
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
        console.log(`笔记本《${title}》创建成功`);
        return true;
    }catch(err) {
        console.log(`笔记本《${title}》创建失败 ${JSON.stringify(err)}`);
        return false;
    }
}

module.exports = createLocalNotebook;