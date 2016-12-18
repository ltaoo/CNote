var Evernote = require('evernote');
var client = new Evernote.Client({
  token: 'S=s1:U=9331f:E=160683e7e51:C=159108d5170:P=1cd:A=en-devtoken:V=2:H=927a3d88ba010a659f8dbf6905f291a9',
  sandbox: true,
  china: true
});

// 创建笔记函数
function makeNote(noteStore, noteTitle, noteBody, parentNotebook, callback) {
 
  var nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
  nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
  nBody += "<en-note>" + noteBody + "</en-note>";
  // Create note object
  // var ourNote = new Evernote.Note();
  var ourNote = {};
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
var noteStore = client.getNoteStore();
makeNote(noteStore, 'node测试创建笔记', '这是一篇使用 node 创建的笔记', null, note => {
  console.log(note)
})