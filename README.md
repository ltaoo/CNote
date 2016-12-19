# 笔记应用 api 分析

## 印象笔记

- 创建笔记
- 查看笔记本
- 获取笔记列表
- 获取笔记内容

在解析过程中发现笔记内容过多会报错。。。修改一些源码
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
直接对为知笔记保存在本地的 ziw 进行处理。

- 提取笔记内容

## 笔记间的互相导入

首先要了解不同的笔记接收什么格式的笔记导入。

### 印象笔记

带行内样式的 html 文档。