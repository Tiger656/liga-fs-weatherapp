import express from "express"
import bodyParser from "body-parser"

const serverPort = 4000;
const server = express();
const COORDINATES_SERVER_URI_TEMPLATE = "https://geocode.maps.co/search?"
const WEATHER_SERVER_URI_TEMPLATE = "https://api.open-meteo.com/v1/forecast?"

server.use(bodyParser.json())

server.post("/weather", (req, res) => {
    getWeatherByPlaceName(req.body.cityName)
        .then(weatherData => res.status(200)
            .send(weatherData))//doesn't work without declared promise(manually)
})


server.listen(serverPort, () => {
    console.log(`Example app listening on port ${serverPort}`)
})

function getWeatherByPlaceName(cityName) {
    return getPlaceCoordinates(cityName)
            .then(cityInfo => retrieveWeatherByPlaces(cityInfo))
    
}

function getPlaceCoordinates(cityName) {
    return new Promise((resolve, reject) => {
        fetch(COORDINATES_SERVER_URI_TEMPLATE + new URLSearchParams({city: cityName}))
        .then(response => response.json())
        .then(data => resolve(data));
    })
}
    

function retrieveWeatherByPlaces(places) {
    let requests = prepareRequestForEachPlace(places)
    return new Promise((resolve, reject) => {
        Promise.all(requests).then(res => 
             parseResponsesToJson(res).then(data => resolve(enrichWeatherWithPlaceName(data, places)))
        );
    }) 
}

function parseResponsesToJson(fetchResponse) {
    return Promise.all(fetchResponse.map((response) => {
             return response.json();
         }))
}
function enrichWeatherWithPlaceName(weathers, places) {
    for(let i = 0; i < places.length; i++) {
        weathers[i].display_name = places[i].display_name
    }
    return weathers;
}

function prepareRequestForEachPlace(places) {
    let requsts = []
    for(let place of places) { 
        requsts.push(prepareRequest(place))
    }
    return requsts;   
} 

function prepareRequest(place) {    
        let request = fetch(WEATHER_SERVER_URI_TEMPLATE + new URLSearchParams({
                    latitude: place.lat,
                    longitude: place.lon,
                    current_weather: true,
                    hourly: "temperature_2m,relativehumidity_2m,windspeed_10m"
                    }))
        return request;   
} 
         