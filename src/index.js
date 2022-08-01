// current date block
function formatDate(now) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentDay = days[now.getDay()];
  let currentDate = now.getDate();
  let currentMonth = month[now.getMonth()];
  let currentHour = now.getHours();
  let currentMinutes = now.getMinutes();

  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  return `${currentDay}, ${currentDate} ${currentMonth} ${currentHour}:${currentMinutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

// forecast block
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row weather-forecast">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastCelciusTempMax[index] = forecastDay.temp.max;
      forecastCelciusTempMin[index] = forecastDay.temp.min;
      forecastHTML =
        forecastHTML +
        `
            <div class="col-sm day-forecast">
              <div class="week-day">${formatDay(forecastDay.dt)}</div>
              <div class="temperature-forecast">
                <span class="temperature-forecast-max" id="forecastTempMax${index}">${Math.round(
          forecastDay.temp.max
        )}°</span>/<span
                  class="temperature-forecast-min" id="forecastTempMin${index}"
                  >${Math.round(forecastDay.temp.min)}°</span
                >
              </div>
              <img src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" alt="" width=70/>
            </div>

            `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "9a904f43cb3ef282a2ff5a4b8504f12f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// show weather block
function showWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  temperatureCelsius = response.data.main.temp;
  document.querySelector("#temperature").innerHTML =
    Math.round(temperatureCelsius);
  document.querySelector("#weather-condition").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#weather-humidity").innerHTML =
    response.data.main.humidity;
  document.querySelector("#weather-wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute(
    "alt",
    `http://openweathermap.org/img/wn/${response.data.weather[0].description}@2x.png`
  );

  getForecast(response.data.coord);
}

// search city block + getCurrentPosition
function searchCity(city) {
  let apiKey = "9a904f43cb3ef282a2ff5a4b8504f12f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function formSearchCity(event) {
  event.preventDefault();
  fahrenheitTemp.classList.remove("active");
  celsiusTemp.classList.add("active");
  let city = document.querySelector("#form-search-city").value.trim();
  if (city.length === 0) {
    alert(`Please enter the city`);
  }
  searchCity(city);
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiKey = "9a904f43cb3ef282a2ff5a4b8504f12f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
  fahrenheitTemp.classList.remove("active");
  celsiusTemp.classList.add("active");
}

// temperature conversion block
function linkFahrenheit(event) {
  event.preventDefault();
  celsiusTemp.classList.remove("active");
  fahrenheitTemp.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  let temperatureFahrenheit = Math.round(temperatureCelsius * 1.8 + 32);
  temperatureFahrenheit = Number(temperatureFahrenheit);
  temperatureElement.innerHTML = temperatureFahrenheit;

  forecastCelciusTempMax.forEach(function (celcTemp, index) {
    document.querySelector(`#forecastTempMax${index}`).innerHTML = Math.round(
      celcTemp * 1.8 + 32
    );
  });

  forecastCelciusTempMin.forEach(function (celcTemp, index) {
    document.querySelector(`#forecastTempMin${index}`).innerHTML = Math.round(
      celcTemp * 1.8 + 32
    );
  });
}

function linkCelsius(event) {
  event.preventDefault();
  fahrenheitTemp.classList.remove("active");
  celsiusTemp.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(temperatureCelsius);

  forecastCelciusTempMax.forEach(function (celcTemp, index) {
    document.querySelector(`#forecastTempMax${index}`).innerHTML =
      Math.round(celcTemp);
  });

  forecastCelciusTempMin.forEach(function (celcTemp, index) {
    document.querySelector(`#forecastTempMin${index}`).innerHTML =
      Math.round(celcTemp);
  });
}

let temperatureCelsius = null;
let forecastCelciusTempMax = [];
let forecastCelciusTempMin = [];

let currentDate = document.querySelector("#current-date-time");
let now = new Date();
currentDate.innerHTML = formatDate(now);

let formSearch = document.querySelector("#form-search");
formSearch.addEventListener("submit", formSearchCity);

let currentPosition = document.querySelector("#current-position");
currentPosition.addEventListener("click", getCurrentLocation);

let celsiusTemp = document.querySelector("#celsius-temperature");
celsiusTemp.addEventListener("click", linkCelsius);

let fahrenheitTemp = document.querySelector("#fahrenheit-temperature");
fahrenheitTemp.addEventListener("click", linkFahrenheit);

searchCity("Vinnytsia");
