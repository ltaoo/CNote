// 创建笔记
import uploadNote from './uploadNote';
// 创建笔记本
import uploadNotebook from './uploadNotebook';
// 更新笔记
import updateNote from './updateNote';
// 获取笔记本并在本地创建对应文件夹
import createLocalNotebooks from './createLocalNotebooks';
// 获取所有笔记并在本地创建对应文件
import createLocalNotes from './createLocalNotes';

export default {
    // 上传笔记到云端
    uploadNote,
    // 上传笔记本到云端
    uploadNotebook,
    // 更新笔记到云端
    updateNote,
    // 创建所有本地笔记本文件夹
    createLocalNotebooks,
    // 创建所有本地笔记文件
    createLocalNotes
};