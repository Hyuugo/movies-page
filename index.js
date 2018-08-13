const express = require('express'),
    pgp = require('pg-promise')(),
    PORT = process.env.PORT || 5000,
    db = pgp(process.env.DATABASE_URL),
    app = express();

app.set('port', PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(function (req, res, next) {
    res.locals.countries = [];
    res.locals.genres = [];

    if (req.path = '/') {
        db.multi('SELECT * FROM movies_countries;SELECT * FROM movies_genres')
            .then(data => {
                for (i = 0; i < data[0].length; i++)
                    res.locals.countries.push(data[0][i].country);
                for (j = 0; j < data[1].length; j++)
                    res.locals.genres.push(data[1][j].genre);
                next();
            })
            .catch(error => {
                console.log('ERROR:', error);
            })
    }
    else {
        next();
    }
});

app.get('/', function (req, res, next) {
    res.render('index');
});

app.get('/search', function (req, res, next) {
    let queryStr = "",
        start = "",
        end = "";

    if (req.query.start)
        start = "OFFSET " + req.query.start;
    if (req.query.end)
        end = "LIMIT " + req.query.end;

    if (req.query.movie_name) {
        if (queryStr.length > 0)
            queryStr += 'AND ';
        queryStr += 'title LIKE \'%' + req.query.movie_name + '%\' ';
    }

    if (req.query.countries) {
        let countries = req.query.countries.split(",");
        if (queryStr.length > 0)
            queryStr += 'AND ';
        queryStr += 'production_countries LIKE \'%' + countries[0] + '%\' ';
        for (i = 1; i < countries.length; i++)
            queryStr += 'AND production_countries LIKE \'%' + countries[i] + '%\' ';
    }

    if (req.query.genres) {
        let genres = req.query.genres.split(",");
        if (queryStr.length > 0)
            queryStr += 'AND ';
        queryStr += 'genres LIKE \'%' + genres[0] + '%\' ';
        for (i = 1; i < genres.length; i++)
            queryStr += 'AND genres LIKE \'%' + genres[i] + '%\' ';
    }

    if (req.query.release_date_start || req.query.release_date_end) {
        if (queryStr.length > 0)
            queryStr += 'AND ';
        queryStr += 'release_date BETWEEN $1 AND $2 ';
    }

    db.any('SELECT * FROM movies_metadata WHERE ' + queryStr + ' ' + start + ' ' + end, [req.query.release_date_start + '-01-01', req.query.release_date_end + '-01-01'])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log("ERROR:", error);
        })
});

app.get('/get', function (req, res, next) {
    let start = "",
        end = "";

    if (req.query.start)
        start = "OFFSET " + req.query.start;
    if (req.query.end)
        end = "LIMIT " + req.query.end;

    db.any('SELECT * FROM movies_metadata ' + start + ' ' + end, [true])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
        })

});


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});