//Interação
const citySearchInput = document.getElementById('city-search-input')
const citySearchButton = document.getElementById('city-search-button')
//Exibição
const currentDate = document.getElementById("current-date")
const cityName = document.getElementById("city-name")
const weatherIcon = document.getElementById("weather-icon")
const weatherDescription = document.getElementById("weather-description")
const currentTemperature = document.getElementById("current-temperature")
const windSpeed = document.getElementById("wind-speed")
const fellsLikeTemperature = document.getElementById("feels-like-temperature")
const currentHumidity = document.getElementById("current-humidity")
const sunriseTime = document.getElementById("sunrise-time")
const sunsetTime = document.getElementById("sunset-time")

const api_key = "9a1022c29163cfe2ffeed2610729ef5f";

//Detecta que o usuario clicou no botão e atribui o valor da barra de pesquisa(nome da cidade) a variavel cityName e então executa a função getCityWeather()
citySearchButton.addEventListener("click", () => {
   let cityName = citySearchInput.value 
   getCityWeather(cityName)
})

//Função para detectar a posição do usuario e carregar o site com as informaçoes corretas
navigator.geolocation.getCurrentPosition(
    (position) => {
        let lat = position.coords.latitude
        let lon = position.coords.longitude
        
        getCurrentLocationWeather(lat, lon)
        
    },
    (err) => {
        if(err.code == 1){
            alert("Geolocalização negada pelo usuário, busque manualmente por uma cidade através da barra de pesquisa.")
        }
        else{
            console.log(err)  
        }
    })

function getCurrentLocationWeather(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${api_key}`)
        .then((response) => response.json ())
        .then((data) => displayWeather(data))
}

//fetch buscar | then então
//Busca a localização atraves da barra de pesquisa
function getCityWeather(cityName){

    weatherIcon.src = `./src/assets/loading-icon.svg`

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${api_key}`)
    .then((response) => response.json ())
    .then((data) => displayWeather(data))
}

function displayWeather(data){
    //Seleciona quais informaçoes do responde.json serão utilizadas(vê no console do dev tools navegador)
    let {dt,
        name,
        weather: [{icon, description}],
        main:{temp, temp_min, temp_max, feels_like, humidity},
        wind:{speed},
        sys:{sunrise, sunset},
    } = data

    //Atribui os valores obtidos as variaveis
    currentDate.textContent = formatDate(dt);
    cityName.textContent = name;

    weatherIcon.src = `./src/assets/${icon}.svg`
    weatherDescription.textContent = description;
    currentTemperature.textContent = `${Math.round(temp)}°C`;
    windSpeed.textContent = `${Math.round(speed * 3.6)}km/h`;
    fellsLikeTemperature.textContent = `${Math.round(feels_like)}°C`;
    currentHumidity.textContent = `${humidity}%`;
    sunriseTime.textContent = formatTime(sunrise);
    sunsetTime.textContent = formatTime(sunset);
}

function formatDate(epochTime){
    let date = new Date(epochTime * 1000)
    let formattedDate = date.toLocaleDateString('pt-BR', { month:"long", day: "numeric"})
    return `Hoje, ${formattedDate}`
}

function formatTime(epochTime){
    let date = new Date(epochTime * 1000)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    return `${hours}:${minutes}`

}