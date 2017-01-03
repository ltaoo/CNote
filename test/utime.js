const fs = require('fs');

// 第二个参数是修改时间
// fs.utimes('date.js', new Date(), new Date(1451397659000), (err, res) => {
//     if(err) console.log(err);

//     console.log(res)
// })

fs.stat('date.js', (err, res) => {
    if(err) console.log(err)
    console.log(res)
})