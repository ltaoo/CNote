const config = require('./config');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

let noteStore = config.noteStore;
const db = config.db;

// 工具方法
const lib = require('./lib');

// 获取笔记列表
function _fetchNote() {
    return new Promise((resolve, reject) => {
        var result = db.getState('notebooks');
        // console.log(result);
        const _ary = result.notebooks.map(notebook => {
            // findNoteMetadata 返回的是一个 promise 实例
            return noteStore.findNotesMetadata({
                notebookGuid: notebook.guid
            }, 0, 0, {
                includeTitle: true,
                includeContentLength: true,
                includeCreated: true,
                // includeUpdated: true,
                // includeDeleted: true,
                // includeUpdateSequenceNum: true,
                includeNotebookGuid: true,
                includeTagGuids: true,
                includeAttributes: true,
                // includeLargestResourceMime: true,
                // includeLargestResourceSize: true
            });
        });

        Promise.all(_ary)
            .then(res => {
                // console.log(res);
                // 拿到了保存每一个笔记本内笔记相关的详细信息，需要用到totalNotes
                // 先把两个数组结合起来
                // result 是旧数组
                for (let i = 0, len = result.notebooks.length; i < len; i++) {
                    result.notebooks[i].totalNotes = res[i].totalNotes;
                }

                // 写入数据库，不关心笔记本下具体有什么笔记，只要知道笔记本下有多少笔记就够了。
                db.setState({
                    notebooks: result.notebooks
                });

                let notebooks = result.notebooks.filter(notebook => {
                    return notebook.totalNotes > 0;
                });

                // 上面处理完毕后，result 数组就给每一个元素(笔记本)增加了 totalNotes 字段。notes 数组是过滤了没有笔记的空笔记本。
                // 读取
                return Promise.all(notebooks.map(notebook => {
                    return noteStore.findNotesMetadata({
                        notebookGuid: notebook.guid
                    }, 0, notebook.totalNotes, {
                        includeTitle: true,
                        includeContentLength: true,
                        includeCreated: true,
                        includeNotebookGuid: true,
                        includeTagGuids: true,
                        includeAttributes: true
                    });
                }))
            })
            .catch(err => {
                reject('获取笔记列表失败-1', err);
            })
            .then(res => {
                // 这里是真正读取笔记的结果
                // console.log(res);
                // 继续遍历获取笔记详情
                let notes = [];
                res.forEach(metadata => {
                    notes.push(...metadata.notes);
                });
                let result = notes.map(note => {
                    return Object.assign({}, {
                        guid: note.guid,
                        title: note.title,
                        notebookGuid: note.notebookGuid,
                        created: note.created,
                        updated: note.updated,
                        deleted: note.deleted,
                        tagGuids: note.tagGuids
                    });
                });
                resolve(result);
            })
            .catch(err => {
                reject('获取笔记列表失败-2', err);
            })
    })
}


function fetchNote() {
    // 暴露给外部的函数
    // 获取笔记列表
    _fetchNote()
        .then(notes => {
            // 如果表不存在，就初始化
            if (!db.has('notes').value()) {
                db.set('notes', []).value();
            }
            // console.log(res);
            // 获取笔记列表成功，读取内容并生成 md 文件
            let ary = notes.map(note => {
              // return noteStore.getNote(note.guid, false, false, false, false);
              return noteStore.getNote(note.guid, true, false, false, false);
            })
            return Promise.all(ary);
        })
        .catch(err => {
            console.log('获取笔记列表失败-3', err);
        })
        .then(notes => {
            // 获取笔记内容成功，然后可以生成对应的文件了
            notes.forEach(note => {
                // 详细笔记
                // 从数据库读取对应笔记本的名字
                let notebook = db.get('notebooks').find({guid: note.notebookGuid}).value();
                // console.log(notebook.name);
                try {
                    fs.writeFileSync(path.join(__dirname, '../note/', notebook.name, note.title), lib.getContent(note.content), 'utf8');
                    // 将笔记列表写入数据库
                    db.get('notes')
                        .push(Object.assign({}, {
                            guid: note.guid,
                            title: note.title,
                            content: note.content,
                            notebookGuid: note.notebookGuid,
                            created: note.created,
                            updated: note.updated,
                            deleted: note.deleted,
                            tagGuids: note.tagGuids
                        }))
                        .value();
                    console.log('笔记', note.title, '创建成功');
                }catch(err) {
                    console.log('生成笔记', note.title, '失败', err);
                }
            })
        })
        .catch(err => {
            console.log('生成笔记文件失败', err);
        })
}

module.exports = fetchNote;

// fetchNote();