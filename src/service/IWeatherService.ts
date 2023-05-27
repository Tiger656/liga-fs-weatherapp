import { Place } from "../type/Place";
import { WeatherFull } from "../type/WeatherFull";


export interface IWeatherService {
    
    getWeatherByPlaceName(cityName: String): Promise<Array<WeatherFull>>;

    retrieveWeatherByPlaces(places: Array<Place>): Promise<Array<WeatherFull>>

}