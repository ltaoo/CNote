let fs = require('fs')

fs.readFile('./result.md', 'utf8', (err, res) => {
  if(err) console.log(err)
  let result = res.replace(/\n\n/g, '\n').replace(/    /g, '').replace(/\n\n/g, '\n')
  fs.writeFileSync('real.md', result, 'utf8')
})