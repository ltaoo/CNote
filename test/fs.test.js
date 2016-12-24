const fs = require('fs');
const path = require('path');

try {
    let result = fs.mkdirSync(path.join('./helo', 'helo'));
    console.log(result);
}catch(err) {
    console.log(err);
}
