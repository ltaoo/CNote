const config = require('./config');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

const juice = require('juice');

const lib = require('./lib');
const db = config.db;

let noteStore = config.noteStore;
const creatNotebook = require('./createNotebook');

// 创建笔记函数
function _makeNote(note) {
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
}

function createNote(title) {
  // 先判断是否存在
  // 获取笔记本和笔记名
  let notebookName = '我的第一个笔记本';
  let noteName = title;
  if(title.indexOf('/') > -1) {
    // 如果存在 / ，就表示要放到指定笔记本内，如果没指定，就是放到默认笔记本里面
    let _ary = title.split('/');
    notebookName = _ary[0];
    noteName = _ary[1];
  }
  // console.log(notebookName, noteName);
  if(!fs.existsSync(path.join(__dirname, '../note', notebookName, noteName))) {
    // 如果不存在
    console.log(title, '不存在');
    return;
  }
  // 获取到内容
  let source = fs.readFileSync(path.join(__dirname, '../note', notebookName, noteName), 'utf8');
  console.log(source);
  // 解析 标签
  let result = lib.getTags(source, md);
  // console.log(result);
  // 渲染 markdown
  let html = md.render(result.source);
  // 读取样式
  let style = fs.readFileSync(path.join(__dirname, './themes', 'github_markdown.css'), 'utf8');
  // 插入行内样式
  let content = juice.inlineContent(html, style);
  // console.log(content);
  // return;
  // 然后就可以新建笔记了
  notebook = db.get('notebooks').find({name: notebookName}).value();
  // 判断笔记本是否已经在印象笔记中存在
  // console.log(notebook);
  if(!notebook) {
    // 如果是新笔记本，就要先创建笔记本
    creatNotebook(notebookName)
      .then(notebook => {
        // 创建成功后，才继续创建笔记
        console.log(`笔记本 《${notebook.name}》 创建成功`);
        return _makeNote({
          noteTitle: noteName.trim(),
          noteBody: content,
          tagNames: result.tagNames,
          parentNotebook: notebook
        });
      })
      .catch(err => {
        console.log('创建笔记本失败，笔记保存至默认笔记本');
      })
      .then(note => {
        console.log(`笔记 “${note.title}” 创建成功`);
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
      })
      .catch(err => {
        console.log(`创建${note.title}失败`);
      })
  } else {
    _makeNote({
      noteTitle: noteName.trim(),
      noteBody: content,
      tagNames: result.tagNames,
      parentNotebook: notebook
    })
    .then(note => {
      console.log(`创建笔记 ${note.title} 成功`);
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
    })
    .catch(err => {
      console.log(`创建${note.title}失败`);
    })
  }
}

// 导出
module.exports = createNote;