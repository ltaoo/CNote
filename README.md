# 笔记应用 api 分析

## 印象笔记

- 创建笔记 
createNote.js
- 创建笔记本 
createNotebook.js
- 获取笔记本列表
evernoteList.js
- 获取笔记列表
evernoteList.js
- 获取笔记内容
evernoteList.js

> 在获取笔记内容过程中发现笔记内容过多会报错。。。修改一些源码
```javascript
// node_modules/evernote/lib/thrift/transport/binaryHttpTransport.js
// 75 行附近
var req = http.request(options, function (res) {
  var chunkCount = 0;
  if (res.statusCode != 200) {
      me.log('Error in Thrift HTTP response: ' + res.statusCode);
      if (callback) callback(res);
  }
  let bufs = [];
  res.on('data', function (chunk) {
      // console.log(chunk, chunk.length, chunkCount);
      // if (++chunkCount > 1) throw Error('Multiple chunks not supported in BinaryHttpTransport');
      bufs.push(chunk);
  });
  res.on('end', function () {
      if (callback) callback(null, new MemBuffer(Buffer.concat(bufs)));
  })
});
```

## 为知笔记
api http://www.wiz.cn/manual/plugin/ 
通过插件`Hello.World`文件夹获取笔记信息。

### 获取当前选择的笔记对象
```javascript
var objApp = WizExplorerApp;
// 获取到窗口
var objWindow = objApp.Window;
var objDocuments = objWindow.DocumentsCtrl.SelectedDocuments;
if (objDocuments && objDocuments.Count >= 1) {
    // 如果有选中的文档，就拿到第一个
    var objDoc = objDocuments.Item(0);
} else {
  // 没有选择笔记
}
```

### 获取笔记标题
```javascript
var title = objDoc.Title;
```

### 获取笔记内容
获取的是纯文本内容，不含 html 标签。
```javascript
var content = objDoc.GetText(0);
```

### 获取笔记创建时间
```javascript
var createTime = objDoc.DateCreated;
```

### 获取笔记标签
```javascript
var tags = objDoc.Tags;
// 遍历
var tagsCount = tags.Count;
var tagsAry = [];
for(var i = 0; i < tagsCount; i++) {
  //

  tagsAry.push(tags.Item(i).Name);
}
alert(JSON.stringify(tagsAry));
```

### 获取笔记所在文件夹
```javascript
var notebook = objDoc.Parent.Name;
```