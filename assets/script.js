$("document").ready(function () {
  $("#start-btn").on("click", function () {
    let searchedCity = $("#city-name").val();
    $("#city-name").val(" ");
    WhatsTheWeather(searchedCity);
    fiveday(searchedCity);
  });

  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (history.length > 0) {
    WhatsTheWeather(history[history.length - 1]);
  }
  for (let i = 0; i < history.length; i++) {
    createRow(history[i]);
  }
  function createRow(text) {
    let listEl = $("<li>").addClass("list-none").text(text);
    $("#search-history").append(listEl);
  }

  $("#search-history").on("click", "li", function () {
    WhatsTheWeather($(this).text());
    fiveday($(this).text());
  });

  function WhatsTheWeather(searchedCity) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchedCity +
        "&appid=6b490bf0f6476248bee4dafc71b2b9a1",
      dataType: "json",
    }).then(function (data) {
      console.log(data);
      if (history.indexOf(searchedCity) === -1) {
        history.push(searchedCity);
        localStorage.setItem("history", JSON.stringify(history));
        createRow(searchedCity);
      }

      $("#current-weather").empty();
      let todayDate = new Date().toLocaleDateString();
      let title = $("<h2>")
        .addClass("font-bold text-xl mb-4")
        .text(data.name + " (" + todayDate + ")");
      let img = $("<img>")
        .addClass("w-80px")
        .attr(
          "src",
          "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
        );

      let card = $("<div>").addClass(
        "max-w-sm rounded overflow-hidden shadow-lg"
      );
      let cardBody = $("<div>").addClass("px-8 py-8 bg-fuchsia-200");
      let wind = $("<p>")
        .addClass("text-black text-base")
        .text("Wind Speed: " + data.wind.speed + " mph");
      let humidity = $("<p>")
        .addClass("text-black text-base")
        .text("Humidity: " + data.main.humidity + " %");

      let itBeFarenheit = ((data.main.temp - 273.15) * 9) / 5 + 32;
      let fTemp = itBeFarenheit.toFixed(2);
      let temp = $("<p>")
        .addClass("text-black text-base")
        .text("Temperature: " + fTemp + " °F");
      let long = data.coord.lon;
      let lat = data.coord.lat;
      $.ajax({
        type: "GET",
        url:
          "https://api.openweathermap.org/data/2.5/uvi?appid=30f6da436f705d0c81e8428ed6246ea8&lat=" +
          lat +
          "&lon=" +
          long,
        dataType: "json",
      }).then(function (response) {
        console.log(response);
      });
      title.append(img);
      cardBody.append(title, temp, humidity, wind);
      card.append(cardBody);
      $("#current-weather").append(card);
    });
  }
  function fiveday(searchedCity) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        searchedCity +
        "&appid=6b490bf0f6476248bee4dafc71b2b9a1",
      dataType: "json",
    }).then(function (data) {
      $("#five-day-forecast")
        .html('<h3 class="mt-4 text-xl bold">5-Day Forecast:</h3>')
        .append('<div class="flex flex-row">');
      console.log(data);
      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          let titleW = $("<h2>")
            .addClass("font-bold text-xl mb-2 text-black")
            .text(new Date(data.list[i].dt_txt).toLocaleDateString());
          let imgW = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/w/" +
              data.list[i].weather[0].icon +
              ".png"
          );
          let colW = $("<div>").addClass(
            "max-w-sm rounded overflow-hidden shadow-lg"
          );
          let cardW = $("<div>").addClass(
            "max-w-sm rounded overflow-hidden shadow-lg bg-fuchsia-200 text-white"
          );
          let cardBodyW = $("<div>").addClass("px-5 py-5 p-3");
          let windW = $("<p>")
            .addClass("text-black text-base")
            .text("Wind Speed: " + data.list[i].wind.speed + "mph");
          let humidW = $("<p>")
            .addClass("text-black text-base")
            .text("Humidity: " + data.list[i].main.humidity + "%");

          let fixTemp = ((data.list[i].main.temp - 273.15) * 9) / 5 + 32;
          let FTemp = fixTemp.toFixed(2);
          let tempW = $("<p>")
            .addClass("text-black text-base")
            .text("Temperature: " + FTemp + " °F");

          colW.append(
            cardW.append(cardBodyW.append(titleW, imgW, tempW, humidW, windW))
          );
          $("#five-day-forecast .flex-row").append(colW);
        }
      }
    });
  }
});
