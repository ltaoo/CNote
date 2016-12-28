function handleTitle(title) {
    // \/：*？“<>|
    var reg= /[\\\/\*\?\|\<\>\:]+/g;
    title = title.replace(reg, '_');
    return title += '.json';
}



let result = handleTitle('<fsdf|serer?“\sdf');

console.log(result);