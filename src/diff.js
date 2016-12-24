require('colors')
var jsdiff = require('diff');


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

