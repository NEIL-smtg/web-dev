const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//	url encoded is used to parse html form data
//	extended is used to post nested object
app.use(bodyParser.urlencoded({extended: true}));

//	dirname = absolute file path to this folder
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
	var num1 = Number(req.body.num1);
	var num2 = Number(req.body.num2);

	var result = num1 + num2;
	res.send('The result is ' + result);
});

app.get('/bmiCalculator', function(req, res) {
	res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post('/bmicalculator', function(req, res) {
	var w = Number(req.body.weight);
	var h = Number(req.body.height);
	var bmi = w / h / h;

	res.send('Your bmi is ' + bmi);
});

app.listen(3000, function () {
	console.log('server listen at port 3000');
});
