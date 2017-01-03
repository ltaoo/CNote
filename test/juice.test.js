const juice = require('juice');

let html = "<h3 class='hello'>hello juice</h3>";
let css = "h3{font-size: 20px;}.hello{font-size: 15px;}";

let result = juice.inlineContent(html, css);

console.log(result);