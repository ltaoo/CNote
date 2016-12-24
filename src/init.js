const fs = require('fs');
const path = require('path');
const low = require('lowdb');


function init(root, dirname) {
    // console.log(root, dirname);
    const rootPath = path.join(root, dirname);
    let success = true;
    // 新建目录
    try {
        fs.mkdirSync(rootPath);
    }catch(err) {
        console.log(`${dirname} 目录创建失败，请检查是否已存在 ${err}`);
        success = false;
    }

    // 生成 db.json 数据库文件
    try {
        fs.writeFileSync(path.join(rootPath, 'db.json'), '', 'utf8');
    }catch(err) {
        console.log('数据库文件初始化失败', err);
        success = false;
    }

    // 生成 config.json 配置文件
    try {
        fs.writeFileSync(path.join(rootPath, 'config.json'), '', 'utf8');
        const configdb = low(path.join(rootPath, 'config.json'));
        // 向数据库写入配置
        // 项目根目录
        configdb.set('root', root).value();
        // 保存笔记的文件名
        configdb.set('dir', dirname).value();
        // 数据库文件名
        configdb.set('db', 'db.json').value();
        // token
        configdb.set('token', '').value();
        // 是否沙盒
        configdb.set('sandbox', true).value();
        // 是否印象笔记
        configdb.set('china', true).value();
    }catch(err) {
        console.log('数据库文件初始化失败', err);
        success = false;
    }
    if(success) {
        console.log('初始化成功');
    } else {
        console.log('初始化失败');
    }
}

module.exports = init;
