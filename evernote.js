var Evernote = require('evernote');
var client = new Evernote.Client({
  token: 'S=s1:U=9331f:E=160683e7e51:C=159108d5170:P=1cd:A=en-devtoken:V=2:H=927a3d88ba010a659f8dbf6905f291a9',
  sandbox: true,
  china: true
});
// 然后获取用户信息
var userStore = client.getUserStore();
userStore.getUser().then(function(user) {
  // user is the returned User object
  console.log(user)
})
.catch(err => {
  console.log(err);
});