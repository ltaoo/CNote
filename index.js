#!/usr/bin/env node
const fs = require('fs');
const program = require('commander')
// 获取执行命令的目录
const path = process.cwd();

const Evernote = require('./src/Evernote');

// 初始化一些默认的信息
program
  //版本信息
  .version('0.1.0')
  // 配置项
  //.option('-n, --create [value]', '将笔记上传至印象笔记')

// 命令
program
  .command('create <file>')
  .description('新建笔记到印象笔记')
  .action((name)=> {
    //
    Evernote.createNote(name);
  });

program
	.command('download')
	.description('从印象笔记下载笔记')
	.action(() => {
		Evernote.fetchNotebookList();
	})


program.parse(process.argv);

// console.log(program)
// 根据命令来进行处理
// if(program.create) {
//   // 如果是 create 参数
//   console.log('新建笔记');
// } else {
//   console.log('显示 help');
// }
