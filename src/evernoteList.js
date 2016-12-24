const client = require('./config');

// 获取笔记本列表
function fetchNotes() {
  let noteStore = client.getNoteStore();
  noteStore.listNotebooks()
    // 获取笔记本列表成功
    .then(function(notebooks) {
      // notebooks is the list of Notebook objects
      // console.log(notebooks);
      return Promise.resolve(notebooks);
    })
    .catch(err => {
      console.log('获取笔记本列表失败', err);
    })
    // 获取笔记本列表成功后，获取笔记列表
    .then(notebooks => {
      // 获取笔记列表
      // https://dev.yinxiang.com/doc/reference/NoteStore.html#Struct_NotesMetadataResultSpec
      let ary = notebooks.map(notebook => {
        return noteStore.findNotesMetadata({
          notebookGuid: notebook.guid
        }, 0, 100, {
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
        })
      })
      return Promise.all(ary);
    })
    .then(res => {
      // console.log(res);
      // 这里得到的是数组，获取笔记内容
      let notes = [];
      let promiseAry = res.map(notebook => {
        notes = notes.concat(notebook.notes);
      })
      // console.log(notes);
      let ary = notes.map(note => {
        // return noteStore.getNote(note.guid, false, false, false, false);
        return noteStore.getNote(note.guid, true, false, false, false);
      })
      return Promise.all(ary);
    })
    .catch(err => {
      console.log('获取笔记列表失败', err);
    })
    .then(notes => {
      // 获取笔记内容成功
      notes.forEach(note => {
        console.log(note);
      });
    })
    .catch(err => {
      console.log('获取笔记详情失败', err);
    })
}