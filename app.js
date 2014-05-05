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

var stockQueryString = 'SELECT dayhigh FROM weatherstockapptable WHERE (company="' + stockSymbol.toUpperCase() + '")';

var weatherQueryString = 'SELECT temperature FROM weatherstockapptable WHERE (zip=' + weatherLocationZip +')';

/*
*  routing
*/
app.get('/', function(req, res){
	var weatherData = [];
	var stockData = [];

	//retrieve info from our database
	//send json objects to client	
	connection.query(weatherQueryString, function(err, rows, fields){
		if(err) throw err;

		for(var r in rows){
			console.log(rows[r].temperature);
			weatherData.push(rows[r].temperature);
		}	

		connection.query(stockQueryString, function(err, rows, fields){
			if(err) throw err;
	
			for(var r in rows){
				console.log(rows[r].dayhigh);
				stockData.push(rows[r].dayhigh);
			}

			console.log(weatherData);
			console.log(stockData);
	
			res.render('index', { weather: {loc: weatherLocationZip, cond: ''},
							      stock:   {company: stockSymbol, high: '', low: ''},
							      json:    {weather: JSON.stringify(weatherData), stock: JSON.stringify(stockData)}
					  });	
		});
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

