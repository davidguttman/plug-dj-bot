var PlugBot = require('..')

// auth = {usr: '"+dlksjdfl..."'}
var auth = require('./auth')

var roomName = 'chillout-mixer-ambient-triphop'

var pb = new PlugBot(auth)

pb.on('error', function(err) {
  console.log('err', err);
})

pb.on('connect', function() {
  console.log('connected!')

  pb.joinRoom(roomName)
  // pb.speak('awesome')
  pb.roomDetails('chillout-mixer-ambient-triphop', function(err, info) {
    console.log('err', err);
    console.log('info', info);
  })
  pb.mediaSelect(function(err, info) {
    console.log('err', err);
    console.log('info', info);
  })
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

