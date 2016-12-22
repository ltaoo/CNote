// https://sandbox.evernote.com/api/DeveloperToken.action
// 创建笔记
const createNote = require('./createNote');
// 创建笔记本
const createNotebook = require('./createNotebook');
// 获取笔记本并在本地创建对应文件夹
const fetchNotebookList = require('./fetchNotebookList');
// 获取所有笔记并在本地创建对应文件
const fetchNoteList = require('./fetchNoteList');
module.exports = {
  createNote,
  createNotebook,
  fetchNotebookList,
  fetchNoteList
};