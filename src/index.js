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

// show weather block
function showWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#weather-condition").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#weather-humidity").innerHTML =
    response.data.main.humidity;
  document.querySelector("#weather-wind").innerHTML = Math.round(
    response.data.wind.speed
  );
}

// search city block + getCurrentPosition
function searchCity(city) {
  let apiKey = "9a904f43cb3ef282a2ff5a4b8504f12f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function formSearchCity(event) {
  event.preventDefault();
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
}

// temperature conversion block
// function linkCelsius(event) {
//   event.preventDefault();
//   let temperatureElement = document.querySelector("#temperature");
//   temperatureElement.innerHTML = 24;
// }
function linkFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let temperature = temperatureElement.innerHTML;
  temperature = Number(temperature);
  temperatureElement.innerHTML = Math.round(temperature * 1.8 + 32);
}

let currentDate = document.querySelector("#current-date-time");
let now = new Date();
currentDate.innerHTML = formatDate(now);

let formSearch = document.querySelector("#form-search");
formSearch.addEventListener("submit", formSearchCity);

// let celsiusTemp = document.querySelector("#celsius-temperature");
// celsiusTemp.addEventListener("click", linkCelsius);

let fahrenheitTemp = document.querySelector("#fahrenheit-temperature");
fahrenheitTemp.addEventListener("click", linkFahrenheit);

let currentPosition = document.querySelector("#current-position");
currentPosition.addEventListener("click", getCurrentLocation);

searchCity("Vinnytsia");
