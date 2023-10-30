const { log } = require('console');
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser'); //look for name in html body

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// 
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post('/', function(req, res) {

	const query = req.body.cityName;
	const apiKey = 'aa57c59c8db6dbe886ab895f952c0781';
	const unit = 'metric';
	const url = "https://api.openweathermap.org/data/2.5/weather?q= "+ query  +"&APPID=" + apiKey + "&units=" + unit;

	https.get(url, function (response) {
	console.log(response.statusCode);
	
	//	when received data
	response.on('data', function (data) {

		const weatherData = JSON.parse(data);
		const temp = weatherData.main.temp;
		const desc = weatherData.weather[0].description;
		const iconID = weatherData.weather[0].icon;
		const iconUrl =  'https://openweathermap.org/img/wn/' + iconID + '@2x.png'
		
		console.log(weatherData);
		console.log(temp);
		console.log(desc);
		res.write("<p>" + temp + "</p>");
		res.write("<h1>" + desc + "</h1>");
		res.write("<img src=" + iconUrl + ">")
		res.send();
	});
});
});

app.listen(3000, function () {
	console.log('server is running on port 3000');
});