const cheerio = require('cheerio');
const config = require('./config');

const noteStore = config.noteStore;
const db = config.db;

const lib = require('./lib');


function fetchNoteDetail(guid) {
    noteStore.getNote(guid, true, false, false, false)
        .then(res => {
            console.log(res);
            // let content = lib.getContent(res.content);
        })
        .catch(err => {
            console.log(err);
        })
}

// const xml = `'<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note><h1 style="box-sizing: border-box;
//  margin: 0.67em 0; margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; padding-bottom: 0.3em; font-size: 2em; border-bottom: 1px solid
//  #eee;">markdown 测试</h1>\n<p style="box-sizing: border-box; margin-top: 0; margin-bottom: 16px;">测试是否能够渲染成美观的 markdown 页面。</p>\n<blockquote s
// tyle="box-sizing: border-box; margin: 0; margin-top: 0; margin-bottom: 16px; padding: 0 1em; color: #777; border-left: 0.25em solid #ddd;">\n<p style="box-siz
// ing: border-box; margin-top: 0; margin-bottom: 0;">这是引用块。</p>\n</blockquote>\n<pre style="box-sizing: border-box; font-family: monospace, monospace; fon
// t: 12px Consolas, \'Liberation Mono\', Menlo, Courier, monospace; margin-top: 0; margin-bottom: 16px; word-wrap: normal; padding: 16px; overflow: auto; font-s
// ize: 85%; line-height: 1.45; background-color: #f7f7f7; border-radius: 3px;"><code style="box-sizing: border-box; font-family: Consolas, \'Liberation Mono\',
// Menlo, Courier, monospace; padding-top: 0.2em; padding-bottom: 0.2em; border-radius: 3px; font-size: 100%; word-break: normal; white-space: pre; background: t
// ransparent; display: inline; max-width: auto; padding: 0; margin: 0; overflow: visible; line-height: inherit; word-wrap: normal; background-color: transparent
// ; border: 0;">// 这是代码\n\nvar a = \'b\';\nconsole.log(\'hello\');\n</code></pre>\n<ul style="box-sizing: border-box; margin-top: 0; margin-bottom: 16px; pa
// dding-left: 2em;">\n<li style="box-sizing: border-box;">这是无序列表</li>\n</ul>\n<h2 style="box-sizing: border-box; margin-top: 24px; margin-bottom: 16px; fo
// nt-weight: 600; line-height: 1.25; padding-bottom: 0.3em; font-size: 1.5em; border-bottom: 1px solid #eee;">二级标题</h2>\n<p style="box-sizing: border-box; m
// argin-top: 0; margin-bottom: 16px;">感觉用的也不怎么多啊。</p>\n</en-note>`;


const marks = {
    em: function(node) {
        if (node.md) {
            return `*${node.md}*`
        }
    },
    strong: function(node) {
        if (node.md) {
            return `**${node.md}**`
        }
    },
    h1: function(node) {
        if (node.md) {
            // console.log(node.md)
            return `\n# ${node.md.data}\n`
        }
    },
    h2: function(node) {
        if (node.md) {
            return `\n## ${node.md.data}\n`
        }
    },
    h3: function(node) {
        if (node.md) {
            return `\n### ${node.md}\n`
        }
    },
    h4: function(node) {
        if (node.md) {
            return `\n#### ${node.md}\n`
        }
    },
    h5: function(node) {
        if (node.md) {
            return `\n##### ${node.md}\n`
        }
    },
    h6: function(node) {
        if (node.md) {
            return `\n###### ${node.md}\n`
        }
    },
    a: function(node) {
        var text = node.md || node.attrs.href
        var href = node.attrs.href || text
        if (text) {
            return `[${text}](${href})`
        }
    },
    img: function(node) {
        var src = node.attrs.src
        if (src) {
            return `![${(node.attrs.title || node.attrs.alt || '').trim()}](${src})`
        }
    },
    blockquote: function(node) {
        var md = node.md
        if (md) {
            md = md.children[0].data;
            // console.log('md', md)
            md = md.replace(/(^\n+|\n+$)/g, '')
            md = md.split('\n').map(function(line) {
                return `> ${line}\n`
            }).join('')
            return `\n${md}\n`
        }
    },
    ul: function(node) {
        if (node.md) {
            return `\n${node.md}\n`
        }
    },
    ol: function(node) {
            var index = 1
            if (node.md) {
                return `\n${node.md}\n`
            }
    },
    li: function (node) {
        if (node.md) {
          return `${node.md}\n`
        }
    },
    hr: function () {
        return '\n---\n'
    },
    code: function (node) {
        if (node.md) {
            if (node.isInPreNode) {
                return node.md
            }
            return `\`${node.md}\``
        }
    },
    br: function () {
        return '\n'
    },
    pre: function (node) {
        var md = node.md
        if (md) {
            md = md.children[0].data
            md = md.split('\n').map(function (line) {
                return `    ${line}\n`
            }).join('')
            return `\n${md}\n`
        }
    },
    p: function (node) {
        var md = node.md
        if (md) {
            return `\n${md.data}\n`
        }
    },
    div: function (node) {
        var md = node.md
        if (md) {
            return `\n${md}\n`
        }
    },
    'default': function (node) {
        return node.md
    },
    cleanup: function (result) {
        // remove leading or tailing break
        // convert \n\n\n... to \n\n
        return result.replace(/(^\n+|\n+$)/g, '')
                     .replace(/\n{3,}/g, '\n\n')
    }
}
// html to markdown
function convert(xml) {
    xml = xml.replace(/\n/g, '');
    // console.log(xml);
    let $ = cheerio.load(xml);
    let body = $("en-note");
    // body['0'] 就是 en-note 节点，即根节点
    let rootNode = body['0'];
    // 用来保存纯文本的变量。
    let content = "";
    rootNode.children.forEach(node => {
        // 处理节点
        // 如果是纯文本
        // console.log(node);
        if(node.type === 'tag') {
            node.md = node.children[0];
            content += marks[node.name].call(null, node);
        } else {
            // 就是文本节点了
            content += '\n';
        }
    })


    // console.log(content);
    return content;
}


fetchNoteDetail('3eacf1dc-38d1-495c-8d88-49aafa8355c7');

// convert(xml);