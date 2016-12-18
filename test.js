let Evernote = require('evernote');
var TextDecoder = require('text-encoding').TextDecoder;
let client = new Evernote.Client({
  token: 'S=s1:U=9331f:E=160683e7e51:C=159108d5170:P=1cd:A=en-devtoken:V=2:H=927a3d88ba010a659f8dbf6905f291a9',
  sandbox: true,
  china: true
});

let noteStore = client.getNoteStore();
noteStore.getNote('9a7f36bd-8dd7-40ac-bf46-6349c815386c', true, false, false, false)
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })