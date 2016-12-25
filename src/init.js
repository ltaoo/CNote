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
        const dbPath = path.join(rootPath, 'db.json');
        fs.writeFileSync(dbPath, '', 'utf8');
        const db = low(dbPath);
        // 数据库添加基本信息
        db.set('notebooks', []).value();
        db.set('notes', []).value();
        db.set('lastUpdate', new Date().getTime()).value();
    }catch(err) {
        console.log('数据库文件初始化失败', err);
        success = false;
    }

    // 生成 config.json 配置文件
    try {
        const configPath = path.join(rootPath, 'config.json');
        fs.writeFileSync(configPath, '', 'utf8');
        const config = low(configPath);
        // 向数据库写入配置
        // 项目根目录
        config.set('root', root).value();
        // 保存笔记的文件名
        config.set('dir', dirname).value();
        // 数据库文件名
        config.set('db', 'db.json').value();
        // token
        config.set('token', '').value();
        // 是否沙盒
        config.set('sandbox', true).value();
        // 是否印象笔记
        config.set('china', true).value();
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
