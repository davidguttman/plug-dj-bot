var plugLogin = require('plug-dj-login')
var PlugBot = require('..')

var auth = 'xxx'

var roomName = 'chillout-mixer-ambient-triphop'

var pb = new PlugBot(auth)

pb.on('error', function(err) {
  console.log('err', err);
})

pb.on('connect', function() {
  console.log('connected!')

  pb.joinRoom(roomName)
  pb.speak('awesome')
})

pb.on('chat', function(message) {
  console.log('message', message);
})

pb.on('disconnect', function() {
  console.log('disconnect!')
})

pb.on('data', function(data) {
  console.log('data', data);
})