const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

const juice = require('juice');

const lib = require('./lib');

const config = require('./config');

const creatNotebook = require('./createNotebook');
const updateDb = require('./updateDb');

// 创建笔记函数
const createNote = require('./api').createNote;

function uploadNote(title) {
  const db = config.getDb();
  // 先判断是否存在
  // 获取笔记本和笔记名
  let notebookName = db.get('defaultNotebook').value();
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
  // console.log(source);
  // 解析 标签
  let result = lib.getTags(source, md);
  // console.log(result);
  // 渲染 markdown
  let html = md.render(result.source);
  html += `<var>${source}</var>`;
  console.log(html);
  // 读取样式
  let style = fs.readFileSync(path.join(__dirname, './themes', 'github_markdown.css'), 'utf8');
  // 插入行内样式
  let content = juice.inlineContent(html, style);
  // console.log(content);
  // return;
  // 然后就可以新建笔记了
  notebook = db.get('notebooks').find({name: notebookName}).value();
  // 判断笔记本是否已经在印象笔记中存在


  // 这一段不知道为什么写在这。。。。。。有点用
  if (!db.has('notes').value()) {
    db.set('notes', []).value()
  }



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
              // content: note.content,
              notebookGuid: note.notebookGuid,
              created: note.created,
              updated: note.updated,
              deleted: note.deleted,
              tagGuids: note.tagGuids
          }))
          .value();
        db.set('lastUpdate', new Date().getTime()).value();
        // 将数据库同步至印象笔记
        updateDb();
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
      console.log(`笔记 “${note.title}” 创建成功`);
      db.get('notes')
        .push(Object.assign({}, {
            guid: note.guid,
            title: note.title,
            // content: note.content,
            notebookGuid: note.notebookGuid,
            created: note.created,
            updated: note.updated,
            deleted: note.deleted,
            tagGuids: note.tagGuids
        }))
        .value();
      db.set('lastUpdate', new Date().getTime()).value();
      // 将数据库同步至印象笔记
      updateDb();
    })
    .catch(err => {
      console.log(err);
    })
  }
}

// 导出
module.exports = uploadNote;