
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

        var currCard = $("<div>").addClass("card")//card body for current daily forecast
        $("#dailyforecast").append(currCard);
        var row = $('<div>').addClass('row no-gutters');
        currCard.append(row);

        var title = $('<h2>').addClass('card-title city').text(response.name); //city name
        currCard.append(title);

        var icon = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"; //grabbing url for image so that it displays in card
        var imageIcon = $("<div>").addClass("col-md-5").append($("<img>").attr("src", icon)); //creating image
        currCard.append(imageIcon);

        var convertTemp = (response.main.temp - 273.15) * 1.8 + 32;//convert to F
        //creating and appending temp, humidity, and wind speed respectively
        var temperatureText = $('<p>').addClass('card-text current-temp city').html("Temperature: " + convertTemp.toFixed(2) + "&#730F");
        currCard.append(temperatureText);

        var humidityText = $('<p>').addClass('card-text current-hum city').text("Humidity: " + response.main.humidity + "%");
        currCard.append(humidityText);

        var windText = $('<p>').addClass('card-text current-wind city').text("Wind Speed: " + response.wind.speed + "MPH");
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

//five day forecast
function weeklyForecast(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response)
        //creating new row for cards
        var divRow = $("<div>").addClass("week-forecast");
        $("#five-day").append(divRow);

        for (var i = 0; i < response.list.length; i++) { //creating cards through loop for 5 day
            
            var day = $("<div>").addClass("weekDay");//hold specific date
            divRow.append(day);
            
            var dayCard = $("<div>").addClass("card bg-primary");//new card
            day.append(dayCard);

            var cardtitle = $("<h3>").addClass("card-title").text(response.list[i].dt_text);
            divRow.append(cardtitle);

            var dayBody = $("<div>").addClass("card-body");
            divRow.append(dayBody);

            dayBody.append("<p>").addClass("card-text city").text("Temperature: " + response.list[i].main.temp);
            dayBody.append("<p>").addClass("card-text city").text("Humidity: " + response.list[i].main.humidity);

            
        }
    });
}




function clearAll() {
    $("#dailyforecast").empty();

}

$(document).on("click", ".city", function () {
    console.log($(this).text());
});
