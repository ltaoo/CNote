const Evernote = require('./Evernote');
// 如果是初始化，表示是重新来，所以先将所有文件删除掉，包括数据库。
// delete all file
function clone() {
    Evernote.createLocalNotebooks()
        .then(() => {
            // 如果笔记本对应的文件夹都创建好了，就可以去获取笔记了
            return Evernote.createLocalNotes();
        })
        .then(res => {
            console.log('同步成功');
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = clone;