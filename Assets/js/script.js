
var searchBtn = $('#search-btn');
var searchHistory = JSON.parse(localStorage.getItem("searches")) || [];
var apiKey = "&appid=0888bb26c1d027c60cb2417244156801";

//search history render
function renderSearchHistory() {
    $("#search-history").empty();
    //looping though search history array
    for (var i = 0; i < searchHistory.length; i++) {
        $("#search-history").append($("<p class = 'city'>").text(searchHistory[i]));
    }
}
//search button listener event
searchBtn.on("click", function (event) {
    event.preventDefault();

    var searchInput = $('#search-input').val().trim(); //user input city
    searchHistory.push(searchInput);
   
    localStorage.setItem("searches", JSON.stringify(searchHistory));
    $("#search-input").val("");
    renderSearchHistory();
    currentForecast(searchInput);
    weeklyForecast(searchInput);
    clearAll();
});
//current weather function
function currentForecast(cityName) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=0888bb26c1d027c60cb2417244156801";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var currCard = $("#dailyforecast")//card body for current daily forecast

        var row = $('<div>').addClass('row no-gutters');
        currCard.append(row);

        var title = $('<h2>').addClass('card-title').text(response.name); //city name
        currCard.append(title);

        var icon = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"; //grabbing url for image so that it displays in card
        var imageIcon = $("<div>").addClass("col-md-5").append($("<img>").attr("src", icon)); //creating image
        currCard.append(imageIcon);

        var convertTemp = (response.main.temp - 273.15) * 1.8 + 32;//convert to F
        //creating and appending temp, humidity, and wind speed respectively
        var temperatureText = $('<p>').addClass('card-text current-temp').html("Temperature: " + convertTemp.toFixed(2) + "&#730F");
        currCard.append(temperatureText);

        var humidityText = $('<p>').addClass('card-text current-hum').text("Humidity: " + response.main.humidity + "%");
        currCard.append(humidityText);

        var windText = $('<p>').addClass('card-text current-wind').text("Wind Speed: " + response.wind.speed + "MPH");
        currCard.append(windText);

        //UV api format
        //http://api.openweathermap.org/data/2.5/uvi/forecast?appid={appid}&lat={lat}&lon={lon}&cnt={cnt}
        //broke apart url for getting long and lat 
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=0888bb26c1d027c60cb2417244156801&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uv) {
            var index = uv.value;
            var changeColor;

            if (index < 3) {
                changeColor = "green";
            } else if (index >= 3 || index < 6) {
                changeColor = "yellow";
            } else if (index >= 6 || index < 8) {
                changeColor = "orange";
            } else {
                changeColor = "red"
            }
            var uvItem = $("<p>").addClass("card-text current-uv").text("UV Index: ")
            uvItem.append($("<span>").attr("style", ("background-color:" + changeColor)).text(index));
            currCard.append(uvItem);
        });
    });
}

//five cards for days
function weeklyForecast(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var divRow = $("#five-day").addClass("fiveday");
        var dayCard = $("<div>").addClass("card col-md-3");
        var dayBody = $("<div>").addClass("card-body");
        divRow.append(dayCard, dayBody);

        for (var i = 0; i < response.list.length; i++) {
            if (response.list[i].dt_text.indexOf("15:00:00") !==-1) {
            var dateTitle = $('<h2>').addClass('card-title').text(response.list[i].dt);
            dayCard.append(dateTitle);

            }
        }
    });
}




function clearAll() {
    $("#dailyforecast").empty();


}

$(document).on("click", ".city", function () {
    console.log($(this).text());
});
