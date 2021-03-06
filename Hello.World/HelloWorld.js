// 实现了导出文件
var objApp = WizExplorerApp;
// 获取到窗口
var objWindow = objApp.Window;
// alert(dir);// D:\新建文件夹\
var database = objApp.Database;
// 获取到所有的笔记本
var folders = database.Folders;
var objCommonUI = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var dir = objCommonUI.SelectWindowsFolder('导出路径');
// 得到的是一个对象，遍历
for(var k = 0, len1 = folders.Count; k < len1; k++) {
    // 先创建文件夹吧
    var folder = folders.Item(k);
    objCommonUI.CreateDirectory(dir + folder.Name);
    var documents = folder.Documents;
    (function () {
        for(var i = 0, len2 = documents.Count; i < len2; i++) {
            var note = documents.Item(i);
            /*
             * 要拿到笔记的重要信息
             * 1、笔记标题
             * 2、笔记内容
             * 3、笔记创建时间
             * 4、笔记标签
             * 5、笔记分类
             */
            var title = note.Title;
            // alert(title);
            var content = note.GetText(0);
            // alert(content);
            var createTime = new Date(note.DateCreated).getTime();
            // alert(createTime);
            var tags = note.Tags;
            // // 遍历
            var tagsCount = tags.Count;
            var tagsAry = [];
            for(var j = 0; j < tagsCount; j++) {
              tagsAry.push(tags.Item(j).Name);
            }
            // alert(JSON.stringify(tagsAry));
            var notebook = note.Parent.Name;
            // alert(notebook);
            // 生成一个对象
            var noteObj = {
                title: title,
                content: content,
                tags: tagsAry,
                createTime: createTime,
                notebook: notebook
            };
            var filename = dir + folder.Name + '\\' + handleTitle(title);
            objCommonUI.SaveTextToFile(filename, JSON.stringify(noteObj), "utf-8");
        }
    })();
}

function handleTitle(title) {
    // 文件名不能包含这些字符 \/：*？“<>|
    var reg= /[\\\/\*\?\|\<\>\:]+/g;
    title = title.replace(reg, '_');
    return title += '.json';
}