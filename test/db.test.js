const config = require('../src/config');
const db = config.db;

let _note = db.get('notes')
        .find({
            title: 'testsadasd.md'
        })
        .value();
console.log(_note);