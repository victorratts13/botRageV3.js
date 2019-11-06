
const config = require('../config/config');
const renko = require('technicalindicators').renko;
const express = require('express');
const app = express();
const request = require('request');
const port = config.UDFPort;
const coinPair = config.pair;

app.use(express.static(__dirname + '/public/'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var remoteURL = config.remoteRequest;
var url = remoteURL+'/api/udf/';
var configure = 'config';
var time = new Date().getTime();
var symbol_info = 'symbol_info';
var symbols = 'symbols?symbol='+coinPair;
var history = 'history';

request({
	url: url + configure,
	json: true
}, (err, response, body) => {
	app.get('/config', (req, res) => {
		res.json(body);
	});
});

request({
	url: url + symbols,
	json: true
}, (err, response, body) => {
	app.get('/symbols', (req, res) => {
		res.json(body);
	});
});

request({
	url: url + time,
	json: true
}, (err, response, body) => {
	app.get('/time', (req, res) => {
		res.json(body);
	});
});

app.get('/history', (req, res) => {
	const {symbol, from, to, resolution} = req.query;
	var query = `?symbol=${symbol}&from=${from}&to=${to}&resolution=${resolution}`;
	request({
		url: url + history + query,
		json: true
	}, (err, response, body) => {

        var rageSlice = -1;
		var closeCandle = body.c.slice(0, rageSlice);
		var highCandle = body.h.slice(0, rageSlice);
		var lowCandle = body.l.slice(0, rageSlice);
		var volCandle = body.v.slice(0, rageSlice);
		var openCandle = body.o.slice(0, rageSlice);
		var timeCandle = body.t.slice(0, rageSlice);
		var candleObj = {
				"c": closeCandle,
				"o": openCandle,
				"v": volCandle,
				"h": highCandle,
				"l": lowCandle,
				"t": timeCandle,
				"s": 'ok'
			}		
		if(err){
			console.log('algum erro ocorreu -> '+err)
			res.json('algum erro ocorreu -> '+err);
		}else{
            var data = {
				"close": closeCandle,
				"open": closeCandle,
				"volume": volCandle,
				"high": closeCandle,
				"low": closeCandle,
				"timestamp": timeCandle
			};
			var result = renko(Object.assign({}, data, {brickSize : config.renko, useATR : false }));

            var JsonResult = {
				"c": result.close,
				"o": result.open,
				"v": result.volume,
				"h": result.high,
				"l": result.low,
				"t": result.timestamp,
				"s": 'ok'
			}

			res.json(JsonResult);
			//res.json(candleObj);
		}
	});
});

app.get('/chart', (req, res) => {
	res.sendFile(__dirname+'/public/index.html');
})

app.get('/', (req, res) => {
    res.send('UDF Protocol in Execution.');
});

app.listen(port, () => {
    console.log('wellcome to BotRage@3.0.1\nUDF in execution on port -> '+port);
});