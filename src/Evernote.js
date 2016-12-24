// 创建笔记
const uploadNote = require('./uploadNote');
// 创建笔记本
const createNotebook = require('./createNotebook');
// 更新笔记
const updateNote = require('./updateNote');
// 获取笔记本并在本地创建对应文件夹
const createLocalNotebooks = require('./createLocalNotebooks');
// 获取所有笔记并在本地创建对应文件
const createLocalNotes = require('./createLocalNotes');
// 获取数据库
const fetchDb = require('./fetchDb');

module.exports = {
    // 上传笔记到云端
    uploadNote,
    updateNote,
    // 创建笔记本
    createNotebook,
    // 创建所有本地笔记本文件夹
    createLocalNotebooks,
    // 创建所有本地笔记文件
    createLocalNotes,
    fetchDb
};