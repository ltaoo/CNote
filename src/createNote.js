const config = require('./config');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

const juice = require('juice');

let noteStore = config.noteStore;

// 创建笔记函数
function _makeNote(note) {
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
      console.log('创建笔记', note.title, '成功');
    })
    .catch(err => {
      console.log(err);
    })
}

function createNote(title) {
  // 获取到内容
  let source = fs.readFileSync(path.join(__dirname, '../note', title), 'utf8');
  // 渲染 markdown
  let html = md.render(source);
  let style = fs.readFileSync(path.join(__dirname, './themes', 'github_markdown.css'), 'utf8');
  let content = juice.inlineContent(html, style);
  // console.log(content);
  // return;
  // 然后就可以新建笔记了
  _makeNote({
    noteTitle: title.trim(),
    noteBody: content
  });
}

// 导出
module.exports = createNote;