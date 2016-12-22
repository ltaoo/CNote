const createNotebook = require('../src/createNotebook');

createNotebook('hello worl')
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })