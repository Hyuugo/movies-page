var slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [1930, 2018],
    connect: true,
    range: {
        'min': 1930,
        'max': 2018
    },
    tooltips: true,
    format: {
        to: function (value) {
            return parseInt(value);
        },
        from: function (value) {
            return parseInt(value);
        }
    }
});

function parseDate(date) {
    let d = new Date(date);
    return d.getFullYear();
}

slider.noUiSlider.on('set.one', function () {
    let sliderValues = slider.noUiSlider.get();
    if (sliderValues[0] == 1930 && sliderValues[1] == 2018)
        movies_list.yearFilter = [];
    else
        movies_list.yearFilter = slider.noUiSlider.get();
    movies_list.loadMore = false;
    movies_list.filterMovies();
});

let movies_list = new Vue({
    el: '#movies_list',
    data: {
        movies: [],
        start: 0,
        end: 9,
        titleFilter: "",
        yearFilter: [],
        genreFilter: [],
        countryFilter: [],
        loadMore: false
    },
    methods: {
        filterMovies: function () {
            let queryStr = "";

            if (this.loadMore == false)
                this.start = 0;

            if (movies_list.titleFilter.length > 0)
                queryStr += 'movie_name=' + this.titleFilter + '&';

            if (movies_list.yearFilter.length > 0)
                queryStr += 'release_date_start=' + movies_list.yearFilter[0] + '&release_date_end=' + movies_list.yearFilter[1] + '&';

            if (movies_list.countryFilter.length > 0)
                queryStr += 'countries=' + movies_list.countryFilter.join() + '&';

            if (movies_list.genreFilter.length > 0)
                queryStr += 'genres=' + movies_list.genreFilter.join() + '&';

            if (queryStr.length > 0) {
                $.get('/search?' + queryStr + '&start=' + this.start + '&end=' + this.end, function (data) {
                    $.each(data, function (index, value) {
                        data[index].poster_path = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + data[index].poster_path;
                        data[index].release_date = parseDate(data[index].release_date);
                    });
                    if (!movies_list.loadMore)
                        movies_list.movies = data;
                    else {
                        $.each(data, function (index, value) {
                            movies_list.movies.push(data[index]);
                        });
                    }
                });
            }
            else {
                $.get('/get?start=' + this.start + '&end=' + this.end, function (data) {
                    $.each(data, function (index, value) {
                        data[index].poster_path = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + data[index].poster_path;
                        data[index].release_date = parseDate(data[index].release_date);
                    });
                    if (!movies_list.loadMore)
                        movies_list.movies = data;
                    else {
                        $.each(data, function (index, value) {
                            movies_list.movies.push(data[index]);
                        });
                    }
                });
            }

            
        }
    }
})

movies_list.filterMovies();

let titleFilter = new Vue({
    el: '#titleFilter',
    methods: {
        addToTitleFilter: function () {
            movies_list.titleFilter = event.target.value;
            movies_list.loadMore = false;
            movies_list.filterMovies();
        }
    }
})

let countryFilter = new Vue({
    el: '#countryFilter',
    data: {
        selected: []
    },
    methods: {
        countryFilter: function (country, itemNumber) {
            if (movies_list.countryFilter.indexOf(country) != -1) {
                movies_list.countryFilter.splice(movies_list.countryFilter.indexOf(country), 1);
                this.selected.splice(this.selected.indexOf(itemNumber), 1);
            }
            else {
                movies_list.countryFilter.push(country);
                this.selected.push(itemNumber)
            }
            movies_list.loadMore = false;
            movies_list.filterMovies();
        }
    }
})

let genreFilter = new Vue({
    el: '#genreFilter',
    data: {
        selected: []
    },
    methods: {
        genreFilter: function (genre, itemNumber) {
            if (movies_list.genreFilter.indexOf(genre) != -1) {
                movies_list.genreFilter.splice(movies_list.genreFilter.indexOf(genre), 1);
                this.selected.splice(this.selected.indexOf(itemNumber), 1);
            }
            else {
                movies_list.genreFilter.push(genre);
                this.selected.push(itemNumber)
            }
            movies_list.loadMore = false;
            movies_list.filterMovies();
        }
    }
})

let loadMoreMovies = new Vue({
    el: '#loadMoreMovies',
    methods: {
        loadMovies: function () {
            movies_list.start += 9;
            movies_list.loadMore = true;
            movies_list.filterMovies();
        }
    }
})

