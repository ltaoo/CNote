const config = require('../src/config');
const db = config.db;

// 查询
let _note = db.get('notes')
        .find({
            title: 'testsadasd.md'
        })
        .value();
console.log(_note);

// 更新
// .assign({ title: 'hi!'})