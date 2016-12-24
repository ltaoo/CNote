# 笔记应用 api 分析


## 使用方式

```bash
git clone https://github.com/ltaoo/noteApplicationApi.git
```

安装依赖
```bash
npm i
```

链接到全局
```bash
npm link
```


### 1、初始化

```bash
note init <dirname>
```
生成保存笔记的文件夹<dirname>并在该目录下新建数据库文件`db.json`，以及配置文件`config.json`。
[申请 token ](https://sandbox.evernote.com/api/DeveloperToken.action) 后替换`config.json`对应`token`字段。

> 如果初始化没有成功，删除已经生成的文件夹重新`init`。

### 2、同步
**进入新建的项目文件夹`<dirname>`**，执行下面命令
```bash
note clone
```
从印象笔记下载笔记到本地，生成对应的笔记本文件与笔记文件。

### 新建笔记

#### 笔记本
在`note`文件夹下的文件夹，都是笔记本，在笔记本文件夹下写笔记。

```bash
note create <name>
```

就可以在印象笔记看到对应的笔记了，会生成对应的笔记本。

```bash
note create example/example.md
```
如果`example`笔记本不存在，会先创建笔记本，再创建`example.md`笔记。

#### 标签

```
# 欢迎使用 evernote
@[tag1|tag2|tag3]
```

将会在印象笔记生成`tag1`、`tag2`和`tag3`标签。

### 更新笔记
```bash
note update <name>
```

将会更新笔记。
> 暂时无法更新笔记名与移动笔记。


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