const fs = require('fs');
const path = require('path');

// 读取配置文件
function readConfig() {
  try {
    var config = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
    config = JSON.parse(config);
    return config;
  }catch(err){
    console.log('未找到配置文件 config.json，请确认当前目录是否存在该文件');
    return false;
  }
}

// 返回印象笔记客户端
function getClient() {
  const config = readConfig();
  const Evernote = require('evernote');
  // 印象笔记 客户端
  const client = new Evernote.Client({
    token: config.token,
    // 是否是沙盒测试账号
    sandbox: config.sandbox,
    // 是否是印象笔记
    china: config.china
  });

  return client;
}

// 返回数据库对象
function getDb() {
  const low = require('lowdb');
  const db = low(path.join(__dirname, config.db));

  return db;
}

// 返回数据库名字
function getDbName() {
  const config = readConfig();
  return config.db;
}

// 返回 noteStore 对象
function getNoteStore() {
  const client = getClient();
  return client.getNoteStore();
}

// 返回 appName 
function getAppName() {
  return 'CNote';
}

module.exports = {
  getDb,
  getClient,
  getDbName,
  getNoteStore,
  getAppName
}
