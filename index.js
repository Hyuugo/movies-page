const express = require('express'),
    PORT = process.env.PORT || 5000,
    app = express();

app.set('port', PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', function (req, res, next) {
	res.render('index');
});

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});