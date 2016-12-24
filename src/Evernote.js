// 创建笔记
const createNote = require('./createNote');
// 创建笔记本
const createNotebook = require('./createNotebook');
// 更新笔记
const updateNote = require('./updateNote');
// 获取笔记本并在本地创建对应文件夹
const fetchNotebookList = require('./fetchNotebookList');
// 获取所有笔记并在本地创建对应文件
const fetchNoteList = require('./fetchNoteList');
// 获取数据库
const fetchDb = require('./fetchDb');

module.exports = {
  createNote,
  updateNote,
  createNotebook,
  fetchNotebookList,
  fetchNoteList,
  fetchDb
};