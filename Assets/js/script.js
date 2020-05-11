var searchInput = $('#search-input');
var searchBtn = $('search-btn');
var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
var searchHistory = []
var apiKey = "0888bb26c1d027c60cb2417244156801"

//takes data from currentForecast and append to card body
var currentCard = function(data) {
    
    var currCard = $("<div>").addClass("card bg-light");
    $('#dailyforecast').append(currCard);

    var row = $('<div>').addClass('row no-gutters');
    var title = $('<h2>').addClass('card-title'); //city name
    var cardText = $('<p>').addClass('card-text'); //info


}


function currentForecast (cityName) {
    queryURL = queryURL + cityName + apiKey
    $.ajex( {
        url : queryURL,
        method: "GET"
    }).then (function(response) {
    
    });
}


var searchCity = function(cityName) {
    queryURL = queryURL + cityName + apiKey;


}

function renderSearchHistory() {

}