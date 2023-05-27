import { WeatherFull } from "../type/WeatherFull";
import { Place } from "../type/Place";
import { IWeatherService } from "./IWeatherService";

const COORDINATES_SERVER_URI_TEMPLATE: String = "https://geocode.maps.co/search?"
const WEATHER_SERVER_URI_TEMPLATE: String = "https://api.open-meteo.com/v1/forecast?"

export class WeatherService implements IWeatherService {  

    getWeatherByPlaceName(cityName: String): Promise<Array<WeatherFull>> {
        return this.getPlaceCoordinates(cityName)
                .then(placesCoordinates  => this.retrieveWeatherByPlaces(placesCoordinates))
        
    }
    
    getPlaceCoordinates(cityName: String): Promise<Array<Place>> {
        return new Promise((resolve, reject) => {
            let params = new URLSearchParams({city: cityName.toString()}).toString()
            fetch(COORDINATES_SERVER_URI_TEMPLATE.concat(params))
            .then(response => response.json())
            .then(places => resolve(places));
        })
    }
        
    
    retrieveWeatherByPlaces(places: Array<Place>): Promise<Array<WeatherFull>> {
        let requests: Array<any> = this.prepareRequestForEachPlace(places)
        return new Promise((resolve, reject) => {
            Promise.all(requests).then(res => 
                this.parseResponsesToJson(res).then(data => resolve(this.enrichWeatherWithPlaceName(data, places)))
            );
        }) 
    }
    
    parseResponsesToJson(fetchResponse: Array<Response>) /*:Promise<Response<WeatherFull>[]>*/ { //TODO
        return Promise.all(fetchResponse.map((response) => {
                 return response.json();
             }))
    }

    enrichWeatherWithPlaceName(weathers: any, places: Array<Place>): Array<WeatherFull> { //TODO
        for(let i = 0; i < places.length; i++) {
            weathers[i].display_name = places[i].display_name
        }
        return weathers;
    }
    
    prepareRequestForEachPlace(places: Array<Place>): Array<Promise<globalThis.Response>> {
        let requsts: Array<Promise<globalThis.Response>> = []
        for(let place of places) { 
            requsts.push(this.prepareRequest(place))
        }
        return requsts;   
    } 
    
    prepareRequest(place: Place): Promise<globalThis.Response> {   
            let params = new URLSearchParams({
                    latitude: place.lat.toString(),
                    longitude: place.lon.toString(),
                    current_weather: true.toString(),
                    hourly: "temperature_2m,relativehumidity_2m,windspeed_10m"
            }).toString()
            let request = fetch(WEATHER_SERVER_URI_TEMPLATE.concat(params))
            return request;   
    } 

}
//Почему не пишется слово function
//Почему везде слово this

