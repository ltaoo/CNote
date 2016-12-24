#!/usr/bin/env node

const fs = require('fs');
const program = require('commander')
    // 获取执行命令的目录
const path = process.cwd();

const Evernote = require('./src/Evernote');
const config = require('./src/config');
const fetchNoteById = require('./src/fetchNoteById');
const lib = require('./src/lib');
const createLocalNote = require('./src/createLocalNote');

const localDb = config.db;

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
    .action((path) => {
        //
        Evernote.createNote(path);
    });


// 更新指定笔记
program.command('update <file>')
    .description('更新指定笔记')
    .action(path => {
        Evernote.updateNote(path);
    });

program.command('init')
    .description('初始化应用，初始化后如需要同步印象笔记，使用 clone')
    .action(() => {
        // 初始化就是在本地初始化 note 文件夹和 db.json 数据库
    })

program.command('clone')
    .description('第一次使用时执行，从印象笔记获取所有笔记')
    .action(() => {
        // 如果是初始化，表示是重新来，所以先将所有文件删除掉，包括数据库。
        // delete all file
        Evernote.fetchNotebookList()
            .then(res => {
                // 如果笔记本对应的文件夹都创建好了，就可以去获取笔记了
                return Evernote.fetchNoteList();
            })
            .catch(err => {
                console.log(err);
            })
            .then(res => {
                console.log('初始化成功！');
            })
            .catch(err => {
                console.log(err);
            })
    });



program
    .command('push')
    .description('将所有修改提交至印象笔记，类似 git 的 push')
    .action(() => {
        // 遍历文件夹，比对，性能很有问题。。。
    })


program.command('pull')
    .description('从印象笔记拉取更新，类似 git 的 pull')
    .action(() => {
        // 从印象笔记下载指定笔记
        Evernote.fetchDb()
            .then(remoteData => {
                // 获取数据库成功后，先比较最后更新时间是否一致
                // console.log(db);

                const localData = localDb.getState();
                const localLastUpdate = localData.lastUpdate;
                const remoteLastUpdate = remoteData.lastUpdate;

                // console.log(localLastUpdate, remoteLastUpdate);

                if(localLastUpdate === remoteLastUpdate) {
                    // 如果本地最后更新时间与远程最后更新时间一致，就表示并没有新的笔记或者更新
                    console.log('没有新内容');
                } else {
                    // 反之就是有了，那就要一一比对？如果笔记数量很多岂不是性能很有问题？
                    // 往往是远端的笔记列表会更多，所以遍历远端的
                    for(let i = 0, len = remoteData.notes.length; i < len; i++) {
                        let note = remoteData.notes[i];
                        let localNote = localDb.get('notes').find({guid: note.guid}).value();
                        if(localNote && localNote.updated === note.updated) {
                            // 如果笔记存在且时间一致，就可以继续下一循环
                            continue;
                        }
                        fetchNoteById(note.guid)
                            .then(note => {
                                // 判断是否笔记本存在
                                const notebook = localDb.get('notebooks').find({guid: note.notebookGuid}).value();
                                if(!notebook) {
                                    // 如果笔记本不存在数据库中，表示这是新笔记本中的新笔记
                                    createLocalNotebook(notebook);
                                }
                                createLocalNote(note);
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
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