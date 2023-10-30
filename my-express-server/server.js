
const express = require('express');
const app = express(); //express module


app.get('/', function(request, response) {
	response.send('hello');
});

app.get('/contact', function (req, res) {
	res.send('Contact me at mmmm');
});

app.get('/about', function (req, res) {
	res.send('haha');
});

app.listen(3000, function () {
	console.log('server started on port 3000');
});

