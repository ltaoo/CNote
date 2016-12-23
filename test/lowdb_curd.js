const path = require('path');
const low = require('lowdb');

const db = low(path.join(__dirname, '../src/note.json'));

// 新增数据
// db.setState({
// 	notebook: ['第一个笔记本']
// });

// 删除数据
/*
	如果数组中存放字符串，remove 传入字符串，并不会删除？
	但是传入 index 可以删除成功
*/
let result = db.get('notebook').remove(0).value();
// 返回的是删除的元素？
console.log(result);

// 读取数据
// let result = db.getState('notebook');
// console.log(result);

// 查询总数
// const count = db.get('notebook').size().value();
// console.log(count);
