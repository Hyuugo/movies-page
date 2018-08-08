const express = require('express'),
    path = require('path'),
    XLSX = require('xlsx'),
    formidable = require('express-formidable'),
    PORT = process.env.PORT || 5000,
    app = express();

app.set('port', PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


app.get('/', function (req, res, next) {
	res.render('index');
});