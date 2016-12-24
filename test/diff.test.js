require('colors')
var jsdiff = require('diff');

var one = 'beep boop';
var other = 'beep boob blah';

one = { "notebooks": [ { "guid": "1af06d6a-0413-4c46-80e8-88a6fbce6792", "name": "我的第一个笔记本", "defaultNotebook": true, "serviceCreated": 1482036442000, "serviceUpdated": 1482498392000, "totalNotes": 0 } ], "notes": [ { "guid": "41aaa1b6-a317-41e7-928a-21a07b3d5727", "title": "hidden.md", "notebookGuid": "1af06d6a-0413-4c46-80e8-88a6fbce6792", "created": 1482500403000, "updated": 1482500405000, "deleted": null, "tagGuids": [ "7bfec902-cbc9-4a21-b82e-212405ea45c6", "90798b2d-8b87-436e-b223-cc5b17858c56" ] } ], "lastUpdate": 1482500405011 };
other = { "notebooks": [ { "guid": "1af06d6a-0413-4c46-80e8-88a6fbce6792", "name": "我的第一个笔记本", "defaultNotebook": true, "serviceCreated": 1482036442000, "serviceUpdated": 1482498392000, "totalNotes": 0 } ], "notes": [ { "guid": "41aaa1b6-a317-41e7-928a-21a07b3d5727", "title": "hidden.md", "notebookGuid": "1af06d6a-0413-4c46-80e8-88a6fbce6792", "created": 1482500403000, "updated": 1482510405000, "deleted": null, "tagGuids": [ "7bfec902-cbc9-4a21-b82e-212405ea45c6", "90798b2d-8b87-436e-b223-cc5b17858c56" ] } ], "lastUpdate": 1489100405011 };

var diff = jsdiff.diffJson(one, other);

diff.forEach(function(part){
  // green for additions, red for deletions
  // grey for common parts
  // 返回 part ，这个 part 是有分一块一块？ 有 added、removed 和 value 属性。
  // var color = part.added ? 'green' :
  //   part.removed ? 'red' : 'grey';
  // process.stderr.write(part.value[color]);

  console.log(part);
  console.log('\n----------------\n');

  // 
  if(part.added) {
    // 如果是 remove 的，就表示这部分有更新，拿到这个时间值，查本地数据库到底是那条笔记发生了更新
    
  }
});


// add 的 lastUpdate 肯定是最新的，因为旧的 lastUpdate 是被 remove 了

