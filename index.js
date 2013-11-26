var request = require('request')
var WebSocket = require('ws')
var util = require('util')
var events = require('events')
var uuid = require('uuid')

var PlugBot = module.exports = function(auth) {
  events.EventEmitter.call(this)
  this.connect(auth)
  return this
}

util.inherits(PlugBot, events.EventEmitter)

PlugBot.prototype.joinRoom = function(roomName) {
  var roomOpts = {
      name: 'join'
    , args: [roomName]
  }
  console.log('joining room', roomName);
  this.ws.send('5::/room:'+JSON.stringify(roomOpts))
}

PlugBot.prototype.speak = function(message) {
  var cid = uuid.v4().replace(/-/g,'').substr(0, 13)
  var message = {
      name: 'chat'
    , args: [{
        msg: message
      , chatID: cid
    }]
  }
  this.ws.send('5::/room:'+JSON.stringify(message))
}

PlugBot.prototype.connect = function(auth, cb) {
  var self = this

  this.getSocketUrl(auth, function(err, socketUrl) {
    if (err) return self.emit('error', err)

    self.ws = new WebSocket(socketUrl)
    self.setEvents()
  })
}

PlugBot.prototype.setEvents = function() {
  var self = this

  self.ws.on('error', function(err) {
    self.emit('error', err)
  })
  
  self.ws.on('open', function() {
    self.ws.send('1::/room') // not sure if this is required...
    self.emit('connect')
  })

  self.ws.on('close', function() {
    self.emit('disconnect')
  })

  self.ws.on('message', function(data, flags) {
    self.emit('data', data)
    var message = self.parseMessage(data)
    self.onData(message)
  })
  
}

PlugBot.prototype.onMessage = function(message) {
  this.emit('chat', message)
  console.log('message', message);
}

PlugBot.prototype.onData = function(message) {
  switch (message.type) {
    case 'heartbeat':
      return this.onHeartbeat()
    case 'message':
      return this.onMessage(message)
    default:
      return
  }
}

PlugBot.prototype.parseMessage = function(data) {
  var message

  if (data == '2::') {
    message = {type: 'heartbeat'}
    return message
  }

  if (data.match(/^5::\/room:/)) {
    var mStr = data.split('5::/room:')[1]
    message = JSON.parse(mStr).args[0]
    return message
  }

  return {type: 'unknown'}
    
}

PlugBot.prototype.getSocketUrl = function(auth, cb) {
  var opts = {
      url: 'https://sio2.plug.dj/socket.io/1/?t=' + Date.now()
    , headers: {
        Cookie: 'usr=' + auth
    }
  }

  request(opts, function(err, res, body) {
    if (err) return cb(err)

    var sockId = body.split(':')[0]
    var sockUrl = 'wss://sio2.plug.dj/socket.io/1/websocket/' + sockId

    cb(null, sockUrl)
  })
}

PlugBot.prototype.onHeartbeat = function() {
  this.ws.send('2::')
}