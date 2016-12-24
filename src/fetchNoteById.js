const cheerio = require('cheerio');
const config = require('./config');

const noteStore = config.noteStore;
const db = config.db;

const lib = require('./lib');


function fetchNoteById(guid) {
    return new Promise((resolve, reject) => {
        noteStore.getNote(guid, true, false, false, false)
            .then(res => {
                // console.log(res);
                // let content = lib.getContent(res.content);
                // resolve(content);
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
}


module.exports = fetchNoteById;