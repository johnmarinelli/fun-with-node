var http = require('http');
var express = require('express');
var jade = require('jade');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var config = {
        "USER" : "",
        "PASS" : "",
        "HOST" : "",
        "PORT" : "",
        "DATABASE" : "",
};

app.get('/', function(req, res){
    res.render('index');
});

app.use(function(err, req, res, next){
    if(req.xhr){
        res.send(500, 'something is wrong');
    }
    else{
        next(err);
    }
});

var server = app.listen(3000, function(){
	console.log('listening on port %d', server.address().port);
});
