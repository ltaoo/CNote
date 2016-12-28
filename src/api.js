// 和云端接口有关的方法

const config = require('./config');

const lib = require('./lib');

const api = {
    //  在云端创建笔记
    createNote(note) {
        const noteStore = config.getNoteStore();
        return new Promise((resolve, reject) => {
            const {
                noteTitle,
                noteBody,
                parentNotebook,
                created,
                tagNames
            } = note;
            let nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
            nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
            nBody += "<en-note>" + noteBody + "</en-note>";
            // Create note object
            // let ourNote = new Evernote.Note();
            let ourNote = {};
            ourNote.title = noteTitle;
            ourNote.content = nBody;
            // 创建时间
            ourNote.created = created || new Date().getTime();
            // 标签
            ourNote.tagNames = tagNames;

            // parentNotebook is optional; if omitted, default notebook is used
            if (parentNotebook && parentNotebook.guid) {
                ourNote.notebookGuid = parentNotebook.guid;
            }

            // Attempt to create note in Evernote account
            noteStore.createNote(ourNote)
                .then(note => {
                    // console.log(note);
                    resolve(note);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },

    // 在云端创建笔记本
    createNotebook(title) {
      const noteStore = config.getNoteStore();
      return new Promise((resolve, reject) => {
        let ourNotebook = {};
        ourNotebook.name = title;

        noteStore.createNotebook(ourNotebook)
          .then(notebook => {
            resolve(notebook);
          })
          .catch(err => {
            // console.log(err)
            reject(err);
          })
      })
    },

    // 更新云端笔记
    updateNote(note) {
        const noteStore = config.getNoteStore();
        return new Promise((resolve, reject) => {
            const {
                guid,
                noteTitle,
                noteBody,
                parentNotebook,
                created,
                tagNames,
                attributes
            } = note;
            // console.log(guid)
            let nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
            nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
            nBody += "<en-note>" + noteBody + "</en-note>";
            // Create note object
            // let ourNote = new Evernote.Note();
            let ourNote = {};
            ourNote.title = noteTitle;
            ourNote.content = nBody;
            // 创建时间
            ourNote.created = created || new Date().getTime();
            // 标签
            ourNote.tagNames = tagNames;
            // guid
            ourNote.guid = guid;
            // 
            ourNote.attributes = attributes;
            // parentNotebook is optional; if omitted, default notebook is used
            if (parentNotebook && parentNotebook.guid) {
                ourNote.notebookGuid = parentNotebook.guid;
            }
            // console.log('hwerew')
            // Attempt to create note in Evernote account
            noteStore.updateNote(ourNote)
                .then(note => {
                    // console.log(note);
                    resolve(note);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },

    // 从云端获取笔记本列表
    fetchNotebooks() {
        const noteStore = config.getNoteStore();
        return new Promise((resolve, reject) => {
            noteStore.listNotebooks()
                // 获取笔记本列表成功
                .then(notebooks => {
                    resolve(notebooks);
                })
                .catch(err => {
                    reject(`fetchNotebooks 获取笔记列表失败 - ${JSON.stringify(err)}`);
                });
        })
    },

    // 从云端获取笔记列表
    fetchNotes() {
        const noteStore = config.getNoteStore();
        return new Promise((resolve, reject) => {
            let _notebooks = [];
            api.fetchNotebooks()
                .then(notebooks => {
                    const _ary = notebooks.map(notebook => {
                        return noteStore.findNotesMetadata({
                            notebookGuid: notebook.guid
                        }, 0, 0, {
                            includeTitle: true
                        });
                    });
                    _notebooks = notebooks;
                    // 获取笔记本列表成功
                    return Promise.all(_ary);
                })
                .catch(err => {
                    reject(`fetchNotes 获取笔记本列表失败 - ${JSON.stringify(err)}`);
                })
                .then(res => {
                    // console.log(res);
                    // res 其实也是数组，保存了每一个笔记本的 元信息
                    // 拿到了保存每一个笔记本内笔记相关的详细信息，需要用到totalNotes
                    // 先把两个数组结合起来
                    // _notebooks 是旧数组
                    for (let i = 0, len = _notebooks.length; i < len; i++) {
                        _notebooks[i].totalNotes = res[i].totalNotes;
                    }

                    // 笔记本数组就添加上了 totalNotes 字段，拿到有笔记的笔记本
                    let notebooks = _notebooks.filter(notebook => {
                        return notebook.totalNotes > 0;
                    });

                    // 如果所有笔记本都没有笔记
                    if(notebooks.length === 0) {
                        resolve(notebooks);
                    }

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
                    reject(`获取笔记元信息失败 - ${JSON.stringify(err)}`);
                })
                .then(metadatas => {
                    // 这里是真正读取笔记的结果
                    // console.log(res);
                    let notes = [];
                    metadatas.forEach(metadata => {
                        notes.push(...metadata.notes);
                    });
                    // console.log(notes);
                    let _notes = notes.map(note => {
                        return {
                            guid: note.guid,
                            title: note.title,
                            notebookGuid: note.notebookGuid,
                            created: note.created,
                            updated: note.updated,
                            deleted: note.deleted,
                            tagGuids: note.tagGuids
                        };
                    });
                    // console.log(_notes);
                    // 这里拿到了笔记数组
                    resolve(_notes);
                })
                .catch(err => {
                    reject(`再次获取笔记元信息失败 - ${JSON.stringify(err)}`);
                })
        })
    },

    // 搜索笔记
    searchNote(filter) {
        const db = config.getDb();
        const noteStore = config.getNoteStore();
        return new Promise((resolve, reject) => {
            const {name} = filter;
            // 先判断印象笔记是否存在
            noteStore.findNotesMetadata({
                words: name
            }, 0, 10, {includeTitle: true})
            .then(res => {
                // console.log(res);
                // if(res.totalNotes === 0) {
                //     // 如果结果为空
                //     resolve(404);
                // }
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
        })
    },

    // 根据 id 获取笔记
    fetchNoteById(guid, notebookName) {
        // console.log(guid, notebookName);
        const noteStore = config.getNoteStore();
        return new Promise((resolve, reject) => {
            noteStore.getNote(guid, true, false, false, false)
                .then(note => {
                    note.notebookName = notebookName;
                    resolve(note);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}

module.exports = api;
