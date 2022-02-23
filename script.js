// Global variables
var searchHistory = [];
const apiKey = '2d6a3c0498c0f4a668ebf3f5e28ae55b';
var lat;
var lon;
var currentDate;
var city;

// DOM element references
var form = document.querySelector('#form');
var todayWeather = document.querySelector('#today-weather');
var forecast = document.querySelector('#forecast');
var searchedCities = document.querySelector('#searched-cities');


function loadWeather() {
    if (localStorage.getItem('searched-cities') ?? '[]') {
        console.log("cities 2")
        getCity();
        startWeather()
        citiesSearched()
    }
}

loadWeather()


// Gets the city from the DOM and the gets the weather for that city
function getCity() {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        city = document.querySelector("form").firstElementChild.value;
console.log(city)
        getLatLon()
    });
}

// Gets the lat/lon
async function getLatLon() {
    var response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );

    latLon = await response.json();

    lat = latLon.coord.lat
    lon = latLon.coord.lon

    let res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts?&cnt=5&appid=${apiKey}&units=imperial`
    );

    let weather = await res.json();

    dailies = weather.daily
    dailies.pop();
    dailies.pop();
    dailies.pop();

    currentDate = weather.current.dt;
    console.log("date",currentDate)

    var weatherToday = `
      <h4 id="w-location">${city} ${weather.current.dt}</h4>
                          <p class="text-dark" id="w-desc">${weather.current.weather[0].description}</p>
                          <p id="w-string">${weather.current.temp}•F</p>
                          <p>Wind: ${weather.current.wind_speed}</p>
                          <p>Humidity: ${weather.current.humidity}</p>
                          <p>UV Index: ${weather.current.uvi}</p>
                          <img id="w-icon" src="https://openweathermap.org/img/w/${weather.current.weather[0].icon}.png" />
     `

    todayWeather.innerHTML = weatherToday;

    var day = ''

    dailies.forEach((daily) => {
        day += `
        <div class="col-md-2">
             <p>${daily.dt}</p>
            <p >Condition: ${daily.weather[0].description}</p>
            <p id="w-string">Temp: ${daily.temp.day}•F</p>
            <p>Wind: ${daily.wind_speed}</p>
            <p>Humidity: ${daily.humidity}</p>
            <p>UV Index: ${daily.uvi}</p>
            <img  id="w-icon" src="https://openweathermap.org/img/w/${daily.weather[0].icon}.png" />
        </div>
`
    })

    forecast.innerHTML = day;

    cityData();
}

// Function to update history in local storage then updates displayed history.
function cityData() {
       var addEntry = {
        "lat": lat,
        "lon": lon,
        "date": currentDate,
        "city": city,
    }

    var searchedCities = JSON.parse(localStorage.getItem('searched-cities')) || [];

    cityExist = searchedCities.some(obj => obj.city === addEntry.city);

    // If the city already exist do not save to local storage
    if (!cityExist) {
        localStorage.setItem('addEntry', JSON.stringify(addEntry));
        searchedCities.push(addEntry);
        localStorage.setItem('searched-cities', JSON.stringify(searchedCities))
    }
}

function citiesSearched() {

    var existingCities = JSON.parse(localStorage.getItem('searched-cities'))

    city = existingCities[0].city;
    lon = existingCities[0].lon;
    lat = existingCities[0].lat;

    // populates the searched cities column
    searched = ''

    var searchedCities = document.getElementById("searched-cities")

    existingCities.forEach((city) => {
        searched +=
            `
                <li> <button type="submit" class="city-button">${city.city}</button>
                    <div class="lat-button">${lat}</div>
                    <div class="lon-button">${lon}</div>
                </li>
            `
        })

    searchedCities.innerHTML = searched;
}

// Function to get search history from local storage
async function startWeather() {

    if (localStorage.getItem('searched-cities')) {
        var existingCities = JSON.parse(localStorage.getItem('searched-cities'))

        city = existingCities[0].city;
        lon = existingCities[0].lon;
        lat = existingCitiesas[0].lat;

        openWeather()
    }
}

async function openWeather() {
    let res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts?&cnt=5&appid=${apiKey}&units=imperial`
    );

    let weather = await res.json();

    var weatherToday = ""

    // FIll in the current weather
    weatherToday = `
                          <h4 id="w-location">${city} ${weather.current.dt}</h4>
                          <p class="text-dark" id="w-desc">${weather.current.weather[0].description}</p>
                          <p id="w-string">${weather.current.temp}•F</p>
                          <p>Wind: ${weather.current.wind_speed}</p>
                          <p>Humidity: ${weather.current.humidity}</p>
                          <p class="uv-index">UV Index: <span class="uv-number">${weather.current.uvi}</span></p>\
                          <p><img id="w-icon" src="https://openweathermap.org/img/w/${weather.current.weather[0].icon}.png" /></p>
     `
    todayWeather.innerHTML = weatherToday;

    var day = ''

    // Fill in the 5 day forecast weather

    // reduce the weather downloaded from 8 to 5 days
    dailies = weather.daily
    dailies.pop();
    dailies.pop();
    dailies.pop();

    dailies.forEach((daily) => {


         day += `
                <div class="col-md-2">
                <p>D ${date}</p>
                    <p>${daily.dt}</p>
                    <p >Condition: ${daily.weather[0].description}</p>
                    <p id="w-string">Temp: ${daily.temp.day}•F</p>
                    <p>Wind: ${daily.wind_speed}</p>
                    <p>Humidity: ${daily.humidity}</p>
                    <p>UV Index: ${daily.uvi}</p>
                    <img  id="w-icon" src="https://openweathermap.org/img/w/${daily.weather[0].icon}.png" />
                </div>
                 `
    })

    forecast.innerHTML = day;

    changeUV();
}

async function cityButton() {
    var cityButtons = document.querySelectorAll('.city-button')

    cityButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            cityDiv = button
            latDiv = cityDiv.nextElementSibling
            lonDiv = latDiv.nextElementSibling

            city = button.innerText
            lat = button.nextElementSibling.innerText
            lon = button.nextElementSibling.innerText



            openWeather()
        })
    })
}
cityButton();

function changeUV(){
    var uvIndex = document.querySelectorAll('.uv-index')
    var indexNum = document.querySelectorAll('.uv-number')


    if (indexNum <= 2) {
        uvIndex.classList.add('d-inline', 'p-2', 'bg-success', 'text-white')
    } else if (indexNum >= 3 && indexNumber <= 7) {
        uvIndex.classList.add('d-inline', 'p-2', 'bg-warning', 'text-white')
    } else {
        uvIndex.classList.add('d-inline', 'p-2', 'bg-danger', 'text-white')
    }
}

