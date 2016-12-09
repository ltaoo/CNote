let fs = require('fs')

let cheerio = require('cheerio')

let content = '';

function getContent(node) {
  if(node.type === 'tag' && node.name === 'br') {
    // 如果这是一个标签，而且没有 data，而且有子元素，就肯定是嵌套的节点，需要获取子节点的内容
  } else if(node.type === 'tag' && !node.data && node.children.length !== 0) {
    node.children.forEach((child, index) => {
      getContent(child);
    })
  } else {
    let str = node.data
    // if(str === '\n    ') {
    //   // 如果这就是一个
    //   str = '\n'
    // }
    str = str.replace(/\n    /g, '\n')
    content += str
  }
}

fs.readFile('./data/index.html', 'utf8', (err, res) => {
  if(err) console.log(err)

  // 拿到 html 内容
  let $ = cheerio.load(res)
  let body = $('body')['0'].children

  // console.log(body)
  // 遍历 body 所有子节点，获取到节点内的内容
  body.forEach((node, index) => {
    // console.log(node)
    // if(node.type === 'text') {
    //   content += node.data;
    // }
    // console.log(node.children)
    // if(node.children && node.children[0] && node.children[0].type === 'text') {
    //   content += node.children[0].data
    // }
    getContent(node);
  })
  // console.log(content)
  // 如果有连续的 \n ，就去掉？
  // let regexp = new RegExp('\n\n')
  // content = content.replace(regexp, '')
  fs.writeFileSync('./result.md', content, 'utf8')
})