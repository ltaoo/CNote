import createLocalNotebooks from './createLocalNotebooks';
import createLocalNotes from './createLocalNotes';
import downloadDb from './downloadDb';

function clone() {
    // 1、首先创建笔记本对应的本地文件夹
    createLocalNotebooks();
    // 2、创建好本地文件夹后，就可以创建本地笔记了
    createLocalNotes();
    // 3、创建完笔记本、笔记后，查看云端数据库文件是否存在
    downloadDb();
    // 这里显示新增的笔记会更好一些？
}

export default clone;