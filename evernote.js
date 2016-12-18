let Evernote = require('evernote');
var TextDecoder = require('text-encoding').TextDecoder;
let client = new Evernote.Client({
  token: 'S=s1:U=9331f:E=160683e7e51:C=159108d5170:P=1cd:A=en-devtoken:V=2:H=927a3d88ba010a659f8dbf6905f291a9',
  sandbox: true,
  china: true
});

let noteStore = client.getNoteStore();
// 获取笔记本列表
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


// 创建笔记函数
function makeNote(noteStore, noteTitle, noteBody, parentNotebook, callback) {
 
  let nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
  nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
  nBody += "<en-note>" + noteBody + "</en-note>";
  // Create note object
  // let ourNote = new Evernote.Note();
  let ourNote = {};
  ourNote.title = noteTitle;
  ourNote.content = nBody;
 
  // parentNotebook is optional; if omitted, default notebook is used
  if (parentNotebook && parentNotebook.guid) {
    ourNote.notebookGuid = parentNotebook.guid;
  }
 
  // Attempt to create note in Evernote account
  noteStore.createNote(ourNote);
}

// 调用创建笔记函数

module.exports = function createNote(title, content) {
  makeNote(noteStore, title, content);
}