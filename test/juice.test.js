const juice = require('juice');

let html = "<h3>hello juice</h3>";
let css = "h3{font-size: 20px;}";

let result = juice.inlineContent(html, css);

console.log(result);