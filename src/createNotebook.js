let Evernote = require('evernote');
let client = new Evernote.Client({
  token: 'S=s1:U=9331f:E=160683e7e51:C=159108d5170:P=1cd:A=en-devtoken:V=2:H=927a3d88ba010a659f8dbf6905f291a9',
  sandbox: true,
  china: true
});

let noteStore = client.getNoteStore();

// 创建笔记本函数
function makeNotebook(noteStore, title) {
  let ourNotebook = {};
  ourNotebook.name = title;

  noteStore.createNotebook(ourNotebook)
    .then(ourNotebook => {
      console.log(ourNotebook);
      console.log('笔记本创建成功');
    })
    .catch(err => {
      console.log('创建失败', err);
    })
}

// makeNotebook(noteStore, 'Nodejs');