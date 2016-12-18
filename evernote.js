let Evernote = require('evernote');
let client = new Evernote.Client({
  token: 'S=s1:U=9331f:E=160683e7e51:C=159108d5170:P=1cd:A=en-devtoken:V=2:H=927a3d88ba010a659f8dbf6905f291a9',
  sandbox: true,
  china: true
});

let noteStore = client.getNoteStore();
// 获取笔记本列表
noteStore.listNotebooks().then(function(notebooks) {
  // notebooks is the list of Notebook objects
  // console.log(notebooks);
  // 获取笔记列表
  // https://dev.yinxiang.com/doc/reference/NoteStore.html#Struct_NotesMetadataResultSpec
  notebooks.forEach(notebook => {
    noteStore.findNotesMetadata({
      notebookGuid: notebook.guid
    }, 0, 100, {
      includeTitle: true,
      includeContentLength: true,
      includeCreated: true,
      // includeUpdated: true,
      // includeDeleted: true,
      // includeUpdateSequenceNum: true,
      // includeNotebookGuid: true,
      includeTagGuids: true,
      includeAttributes: true,
      // includeLargestResourceMime: true,
      // includeLargestResourceSize: true
    }).then(notes => {
      console.log(notes);
    }).catch(err => {
      console.log(err);
    })
  })
})
.catch(err => {
  console.log('获取笔记本列表失败', err);
});


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