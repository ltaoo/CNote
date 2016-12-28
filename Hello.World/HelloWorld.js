// 实现了导出文件
var objApp = WizExplorerApp;
// 获取到窗口
var objWindow = objApp.Window;
var objCommonUI = objApp.CreateWizObject("WizKMControls.WizCommonUI");

var database = objApp.Database;
// 获取到所有的笔记本
var folders = database.Folders;
var count = 0;
// 得到的是一个对象，遍历

// 获取第一个文件夹内所有文档
var documents = folders.Item(0).Documents;

var dir = objCommonUI.SelectWindowsFolder('导出路径');
// alert(dir);// D:\新建文件夹\
for(var i = 0, len = documents.Count; i < len; i++) {
    var note = documents.Item(i);
    // 获取到了最重要的信息，可以导出了
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
    let noteObj = {
        title: title,
        content: content,
        tags: tagsAry,
        createTime: createTime,
        notebook: notebook
    };
    // var result = '---\n';
    // result += 'title:'+title+'\n';
    // result += 'created:'+createTime+'\n';
    // result += 'tags:'+JSON.stringify(tagsAry)+'\n';
    // result += '---\n';
    // result += content;
    // var filename = objCommonUI.SelectWindowsFileEx(false, "Mht files (*.mht)|*.mht|Html files (*.htm)|*.htm|Zip files (*.zip)|*.zip|Ziw files (*.ziw)|*.ziw|Text files (*.txt)|*.txt|", title, "mht");
    var filename = dir + handleTitle(title);
    objCommonUI.SaveTextToFile(filename, JSON.stringify(noteObj), "utf-8");
}

// alert(notes.length);


// for(var i = 0, len = folders.Count; i < len; i++) {
//     var title = folders.Item(i).Name;
//     // alert(title);
//     var documents = folders.Item(i).Documents;
//     count += documents.Count;
// }
// // 这是笔记总数
// alert(count);


// // 获取到选中的文档
// var objDocuments = objWindow.DocumentsCtrl.SelectedDocuments;
// if (objDocuments && objDocuments.Count >= 1) {
//     // 如果有选中的文档，就拿到第一个
//     var objDoc = objDocuments.Item(0);
//     // alert(objDoc.Title);
//     // 创建一个通用 UI
//     var objCommonUI = objApp.CreateWizObject("WizKMControls.WizCommonUI");
//     //
//     var reg = new RegExp('[/\\:*?*<>|]', 'g');
//     // 标题中是否存在 : 这些文件
//     if (reg.test(objDoc.Title)) {
//         // 如果有，就获取到当前
//         var locFileName = objApp.GetPluginPathByScriptFileName('SaveAs.js') + 'SaveAs.ini';
//         //
//         alert(objApp.LoadStringFromFile(locFileName, 'strSpecialCharacter'));
//     }
//     else { 
//         // 这里应该是指文件名符合格式的情况
//         // 就弹出一个窗口，显示文件名，并且可选 mht htm txt
//         // SelectWindowsFolder
//         // var filename = objCommonUI.SelectWindowsFileEx(false, "Mht (*.mht)|*.mht|Html(*.htm)|*.htm|text (*.txt)|*.txt|", objDoc.Title, "mht");
//         var filename = objCommonUI.SelectWindowsFolder('导出路径');
//         /*
//          * 要拿到笔记的重要信息
//          * 1、笔记标题
//          * 2、笔记内容
//          * 3、笔记创建时间
//          * 4、笔记标签
//          * 5、笔记分类
//          */
//         var title = objDoc.Title;
//         alert('标题是 ' + title);
//         var content = objDoc.GetText(0);
//         alert('内容是 ' + content);
//         var createTime = objDoc.DateCreated;
//         alert('创建时间是 ' + createTime);
//         var tags = objDoc.Tags;
//         // 遍历得到
//         var tagsCount = tags.Count;
//         var tagsAry = [];
//         for(var i = 0; i < tagsCount; i++) {
//           //

//           tagsAry.push(tags.Item(i).Name);
//         }
//         alert('标签有 ' + JSON.stringify(tagsAry));
//         var notebook = objDoc.Parent.Name;
//         alert('笔记在 ' + notebook + ' 文件夹内');
//     }
// } else {
//   alert('请先选择一篇笔记');
// }
function handleTitle(title) {
    // if(/(\.md)$/g.test(title)) {
    //     // 如果是以 md 结尾的
    //     return title;
    // }
    // 如果不是
    title = title.replace('.', '_');
    return title += '.json';
}