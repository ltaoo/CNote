import fs from 'fs';
import path from 'path';
import uploadNotebook from './uploadNotebook';
import uploadNote from './uploadNote';


export default async function importNote(dir) {
    // dir 是保存笔记的绝对路径
    let result = null;
    try {
        result = fs.readdirSync(dir);
    }catch(err) {
        console.log(err);
    }
    // 剔除掉回收站、草稿文件夹内的
    for(let i = 0, len = result.length; i < len; i++) {
        let notebook = result[i];
        if(notebook === 'My Drafts' || notebook === 'Deleted Items') {
            continue;
        }

        // 处理的是正常的笔记，首先肯定要创建笔记本
        let notes = [];
        try {
            notes = fs.readdirSync(path.join(dir, notebook));
            for(let j = 0, length = notes.length; j < length; j++) {
                let noteName = notes[j];
                let filepath = path.join(dir, notebook, noteName);
                let noteContent = fs.readFileSync(filepath);
                // 拿到笔记对象
                let note = JSON.parse(noteContent);
                let title = handleTitle(note.title);
                // 同时上传至云端
                // 先创建笔记本
                let some = await uploadNote(`${notebook}/${title}`, note.createTime);
                // console.log(some, 'hello');
            }
            // notes.forEach(async function (noteName) {
            // })
        }catch(err) {
            console.log(err);
        }
    }
}
// 处理文件名
function handleTitle(title) {
    // 文件名不能包含这些字符 \/：*？“<>|
    var reg= /[\\\/\*\?\|\<\>\:]+/g;
    title = title.replace(reg, '_');

    // 如果没有 md 就加上
    if(title.indexOf('.md') === -1) {
        title += '.md';
    }

    return title;
}