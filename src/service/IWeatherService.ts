import { Place } from "../type/Place.ts";
import { WeatherFull } from "../type/WeatherFull.ts";

export interface IWeatherService {
    
    getWeatherByPlaceName(cityName: string): Promise<Array<WeatherFull>>;

    retrieveWeatherByPlaces(places: Array<Place>): Promise<Array<WeatherFull>>

}