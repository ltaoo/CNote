import fs from 'fs';
import path from 'path';
import uploadNotebook from './uploadNotebook';

export default async function importNotebook(dir) {
    // dir 是保存笔记的绝对路径
    let result = null;
    try {
        result = fs.readdirSync(dir);
    }catch(err) {
        console.log(err);
    }
    // 这里获取到的都应该是文件夹，就直接按照文件夹来处理了
    console.log(result);
    // 剔除掉回收站、草稿文件夹内的
    for(let i = 0, len = result.length; i < len; i++) {
        let notebook = result[i];
        if(notebook === 'My Drafts' || notebook === 'Deleted Items') {
            continue;
        }

        // 处理的是正常的笔记，首先肯定要创建笔记本
        let notes = [];
        try {
            fs.mkdirSync(notebook);
            // 创建完笔记本后，就可以创建笔记了
            notes = fs.readdirSync(path.join(dir, notebook));
            await uploadNotebook(notebook);
        }catch(err) {
            console.log(err);
        }
    }
}