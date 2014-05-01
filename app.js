var http = require('http');
var express = require('express');
var jade = require('jade');
var YQL = require('yql');
var mysql = require('mysql');

/*
*  express configurations
*/
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
/*
*  get weather information for sunnyvale, CA (Yahoo's HQ)
*/

var weatherInfo = {
	loc: '',
	cond: '',
	temp: 0,
};

new YQL.exec("SELECT * FROM weather.forecast WHERE (location = @zip)", function(response){
	weatherInfo.loc = response.query.results.channel.location.city;
	weatherInfo.temp = parseFloat(response.query.results.channel.item.condition.temp);
	weatherInfo.cond = weatherInfo.temp + ' degrees; ' + response.query.results.channel.item.condition.text;

	console.log(weatherInfo.loc);
	console.log(weatherInfo.cond);
}, {"zip": 85282});

/*
*  get stock information for Yahoo
*/

var stockInfo = {
	dayHigh: 0,
	dayLow: 0,
};

new YQL.exec("SELECT * FROM yahoo.finance.quote where symbol='yhoo'", function(response){
	stockInfo.dayHigh = parseFloat(response.query.results.quote.DaysHigh);
	stockInfo.dayLow = parseFloat(response.query.results.quote.DaysLow);
});

/*
*  routing
*/
app.get('/', function(req, res){
    res.render('index', { weather: {loc: weatherInfo.loc, cond: weatherInfo.cond}, stock: {high: stockInfo.dayHigh, low: stockInfo.dayLow} });
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
var server = app.listen(3000, function(){
	console.log('listening on port %d', server.address().port);
});

