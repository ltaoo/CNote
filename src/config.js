let Evernote = require('evernote');
let client = new Evernote.Client({
	// 申请https://sandbox.evernote.com/api/DeveloperToken.action
  // ↓ 填写自己的 token
  token: 'S=s1:U=9331f:E=160683e7e51:C=159108d5170:P=1cd:A=en-devtoken:V=2:H=927a3d88ba010a659f8dbf6905f291a9',
  // 是否是沙盒测试账号
  sandbox: true,
  // 是否是印象笔记
  china: true
});

// 数据库
const path = require('path');
const low = require('lowdb');
const db = low(path.join(__dirname, './note.json'));

module.exports = {
	db,
	client,
	noteStore: client.getNoteStore(),
	userStore: client.getUserStore()
};