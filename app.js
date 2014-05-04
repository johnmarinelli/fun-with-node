var http = require('http');
var express = require('express');
var jade = require('jade');
var mysql = require('mysql');
var utility = require('utility');
var querystring = require('querystring');
var util = require('util');

/*
*  express configurations
*/
var app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var config = {
        "USER" : "",
        "PASS" : "",
        "HOST" : "",
        "PORT" : "",
        "DATABASE" : "",
};

/*
*  connect to mysql table
*/ 
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'administrator',
	password: '',
	database: 'test',
});

connection.connect();

var weatherInfo;
var weatherLocationZip = 94089;

var stockInfo;
var stockSymbol = 'yhoo';

/*
*  routing
*/
app.get('/', function(req, res){
	utility.bigQuery(weatherLocationZip, stockSymbol, function(err, weatherdata, stockdata){
		if(err) throw err;
		weatherInfo = weatherdata;
		stockInfo = stockdata;
		
	    res.render('index', { weather: {loc: weatherInfo.loc, cond: weatherInfo.cond}, stock: {company: stockInfo.company, high: stockInfo.dayHigh, low: stockInfo.dayLow}, json: {weather: JSON.stringify([84, 39, 29, 19]), stock: JSON.stringify([1.29, 3.30, 4.20, 6.66])} });
	});
});

app.post('/getinput', function(req, res){
	var chunk = '';
	req.on('data', function(data){
		chunk += data;
	});
	req.on('end', function(){
		if(utility.validateInput(querystring.parse(chunk)) === true){
			weatherLocationZip = parseInt(querystring.parse(chunk).weather);
            stockSymbol = querystring.parse(chunk).stocks;
			res.redirect('/');	
		}
		else{
		}
	});
});

app.use(function(err, req, res, next){
    if(req.xhr){
        res.send(500, 'something is wrong');
    }
    else{
        next(err);
    }
});

/*
*  go node go
*/
var server = app.listen(1337, function(){
	console.log('listening on port %d', server.address().port);
});

