var mysql = require('mysql');
var utility = require('utility');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'administrator',
	password: '',
    database: 'test'
});

connection.connect();

var weatherInfo;
var stockInfo;

var sunnyvaleZip = 94089;
var yahooSymbol = 'yhoo';

var cupertinoZip = 95014;
var appleSymbol = 'aapl'; 

var AMOUNT_OF_COMPANIES = 3;
var zipCodes = [94089, 95014, 94043];
var symbols = ['yhoo', 'aapl', 'goog'];

var callsRemaining = AMOUNT_OF_COMPANIES-1;

for(var i = 0; i < AMOUNT_OF_COMPANIES; i++){
	utility.bigQuery(zipCodes[i], symbols[i], function(err, weatherdata, stockdata){
	        if(err){
				console.error(err);
				 throw err;
			}
	        weatherInfo = weatherdata;
	        stockInfo = stockdata;
	
			var queryString = 'insert into weatherstockapptable (company, location, zip, temperature, dayhigh, daylow, date) VALUES ("' + stockInfo.company + '", "' + weatherInfo.loc + '", ' + weatherInfo.zip + ', '  + weatherInfo.cond + ', ' + stockInfo.dayHigh + ', ' + stockInfo.dayLow + ', ' + 'NOW()' + ')';

			connection.query(queryString, function(err, rows, fields){
				if(err){
					console.error(err);
					throw err;
				}
			
				--callsRemaining;
			});

			console.log(callsRemaining);
			if(callsRemaining <= 0){
				connection.end();
			}
	});
}
