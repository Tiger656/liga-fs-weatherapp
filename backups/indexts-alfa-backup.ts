import express, {Express, Request, Response} from "express"
import bodyParser from "body-parser"
import { WeatherFull } from "../src/type/WeatherFull";
import { Place } from "../src/type/Place";

const serverPort: Number = 4000;
const server: Express = express();
const COORDINATES_SERVER_URI_TEMPLATE: String = "https://geocode.maps.co/search?"
const WEATHER_SERVER_URI_TEMPLATE: String = "https://api.open-meteo.com/v1/forecast?"

server.use(bodyParser.json())

server.post("/weather", (req: Request, res: Response) => {
    getWeatherByPlaceName(req.body.cityName)
        .then(weatherData => res.status(200)
            .send(weatherData))//doesn't work without declared promise(manually)
})


server.listen(serverPort, () => {
    console.log(`Example app listening on port ${serverPort}`)
})

function getWeatherByPlaceName(cityName: String): Promise<Array<WeatherFull>> {
    return getPlaceCoordinates(cityName)
            .then(placesCoordinates  => retrieveWeatherByPlaces(placesCoordinates))
    
}

function getPlaceCoordinates(cityName: String): Promise<Array<Place>> {
    return new Promise((resolve, reject) => {
        let params = new URLSearchParams({city: cityName.toString()}).toString()
        fetch(COORDINATES_SERVER_URI_TEMPLATE.concat(params))
        .then(response => response.json())
        .then(places => resolve(places));
    })
}
    

function retrieveWeatherByPlaces(places: Array<Place>): Promise<Array<WeatherFull>> {
    let requests: Array<any> = prepareRequestForEachPlace(places)
    return new Promise((resolve, reject) => {
        Promise.all(requests).then(res => 
             parseResponsesToJson(res).then(data => resolve(enrichWeatherWithPlaceName(data, places)))
        );
    }) 
}

function parseResponsesToJson(fetchResponse: Array<Response>) /*:Promise<Response<WeatherFull>[]>*/ { //TODO
    return Promise.all(fetchResponse.map((response) => {
             return response.json();
         }))
}
function enrichWeatherWithPlaceName(weathers: any, places: Array<Place>): Array<WeatherFull> { //TODO
    for(let i = 0; i < places.length; i++) {
        weathers[i].display_name = places[i].display_name
    }
    return weathers;
}

function prepareRequestForEachPlace(places: Array<Place>): Array<Promise<globalThis.Response>> {
    let requsts: Array<Promise<globalThis.Response>> = []
    for(let place of places) { 
        requsts.push(prepareRequest(place))
    }
    return requsts;   
} 

function prepareRequest(place: Place): Promise<globalThis.Response> {   
        let params = new URLSearchParams({
                latitude: place.lat.toString(),
                longitude: place.lon.toString(),
                current_weather: true.toString(),
                hourly: "temperature_2m,relativehumidity_2m,windspeed_10m"
        }).toString()
        let request = fetch(WEATHER_SERVER_URI_TEMPLATE.concat(params))
        return request;   
} 


         