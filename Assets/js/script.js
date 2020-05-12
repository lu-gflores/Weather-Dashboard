var searchInput = $('#search-input').val().trim();
var searchBtn = $('#search-btn');

var searchHistory = JSON.parse(localStorage.getItem("searches")) || [];
var apiKey = "&appid=0888bb26c1d027c60cb2417244156801"


//takes data from currentForecast and append to card body dailyforecast
var currentCard = function(data) {
    
    var currCard = $("#dailyforecast")//card body for current daily forecast

    var row = $('<div>').addClass('row no-gutters');
    currCard.append(row);

    var title = $('<h2>').addClass('card-title').text(data.city.name); //city name
    currCard.append(title);

    var convertTemp = (data.main.temp - 273.15) * 1.8 + 32;//convert to F
    //creating and appending temp, humidity, and wind speed respectively
    var temperatureText = $('<p>').addClass('card-text current-temp').text("Temperature: " + convertTemp );
    currCard.append(temperatureText);

    var humidityText =$('<p>').addClass('card-text current-hum').text("Humidity: " + data.main.humidity + "%");
    currCard.append(humidityText);

    var windText = $('<p>').addClass('card-text current-wind').text("Wind Speed: " + data.wind.speed + "MPH");
    currCard.append(windText);
    
}
//search history render
function renderSearchHistory() {
    $("#search-history").empty();
    for(var i = 0; i < searchHistory.length; i++) {
        $("#search-history").append($("<p class = 'city>'").text(searchHistory[i]));
    }

}
//search button listener event
searchBtn.on("click", function(event) {
    event.preventDefault();
    searchHistory.push(searchInput);
    localStorage.setItem("searches", JSON.stringify(searchHistory));
    currentForecast(searchInput);
});

function currentForecast (cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + apiKey;
    $.ajax( {
        url : queryURL,
        method: "GET"
    }).then (function(response) {
        currentCard(response);
        console.log(response);
    });
}

$(document).on("click", ".city", function() {
    console.log($(this).text());
});

