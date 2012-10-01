/**
 * Module dependencies.
 */

var express = require('express')
  , io = require('socket.io')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
//   app.use(express.cookieParser('your secret here'));
//   app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/stream', routes.stream);
app.get('/st', routes.st);
app.get('/users', user.list);

var http_app = http.createServer(app);
var clients = {};

http_app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var sio = io.listen(http_app, { log: false });
// sio.set('log level', 2); // remove the debug messages
sio.sockets.on('connection', function (socket) {
    // console.log('A socket connected!');
    var userid;
    socket.on('user', function(data) {
      userid = data.userid;
      clients[data.userid] = socket;
      for (var client in clients) {
        var s = clients[client];
        if (userid !== client) {
          s.emit('user', data);
          socket.emit('user', {'userid': client }); 
        }
      }
    });
    socket.on('video', function (data) {
      // console.log(data);
      for (var client in clients) {
        // broadcast to all sockets listening
        var s = clients[client];
        if (userid !== client) {
          s.emit(userid, data);
        }
      }
    });
    socket.on('disconnect', function () {
      delete clients[userid];
      sio.sockets.emit('userdel', {'userid': userid});
    });
});
