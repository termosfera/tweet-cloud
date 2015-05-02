var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// twitter streaming
var Twitter = require('twitter');
var twitterConfig = require('./config/twitter-config');
var client = new Twitter(twitterConfig);

client.stream('statuses/filter', { track: 'Microsoft' }, function (stream) {
    
    stream.on('data', function (tweet) {
        io.emit("tweet", { text: tweet.text });
    });
    
    stream.on('error', function (error) {
        throw error;
    });

});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

http.listen(port, function () {
    console.log('listening on *:3000');
});