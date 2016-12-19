let Evernote = require('evernote');
var TextDecoder = require('text-encoding').TextDecoder;
let client = new Evernote.Client({
  token: 'S=s1:U=9331f:E=160683e7e51:C=159108d5170:P=1cd:A=en-devtoken:V=2:H=927a3d88ba010a659f8dbf6905f291a9',
  sandbox: true,
  china: true
});

let noteStore = client.getNoteStore();

// 创建笔记函数
function makeNote(noteStore, note, callback) {
  const {noteTitle, noteBody, parentNotebook, created, tagNames} = note;
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
      if(note.title === noteTitle) {
        console.log('笔记创建成功');
      }
    })
    .catch(err => {
      console.log(err);
    })
}

// 调用创建笔记函数

module.exports = function createNote(note) {
  makeNote(noteStore, note);
}