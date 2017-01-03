import fs from 'fs';
import path from 'path';
export default function importNote(dir) {
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
        }catch(err) {
            console.log(err);
        }

        notes.forEach(note => {
            let filepath = path.join(dir, notebook, note);
            try {
                let noteContent = fs.readFileSync(filepath);
                // 拿到笔记对象
                let note = JSON.parse(noteContent);
                // 现在可以创建笔记了
                let content = note.content;
                // 插入标签语法
                let tagsText = createTags(note.tags);
                if(tagsText) {
                    content = tagsText + content;
                }
                let title = handleTitle(note.title);
                // 标题、正文、标签、笔记本都有了，可以创建 md 文件了，创建文件后再修改笔记的创建时间
                fs.writeFileSync(path.join(note.notebook, title), content, 'utf8');
                // 修改 md 文件创建时间
            }catch(err) {
                console.log(err);
            }
        })
    }
}

function createTags(tags) {
    if(tags.length === 0) {
        return false;
    }
    return '@[' + tags.join('|') + ']';
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