/* eslint-disable import/prefer-default-export */
import { WeatherFull } from "../type/WeatherFull";
import { Place } from "../type/Place";
import { IWeatherService } from "./IWeatherService";

const COORDINATES_SERVER_URI_TEMPLATE = "https://geocode.maps.co/search?";
const WEATHER_SERVER_URI_TEMPLATE = "https://api.open-meteo.com/v1/forecast?";

export class WeatherService /* implements IWeatherService */ {


  async getWeatherByPlaceName(cityName: string): Promise<Array<WeatherFull>> {
    const placesCoordinates = await this.getPlaceCoordinates(cityName);
    const weatherFull = await this.retrieveWeatherByPlaces(placesCoordinates);
    return weatherFull;
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  async getPlaceCoordinates(cityName: string): Promise<Place[]> {
    const params = new URLSearchParams({ city: cityName.toString() }).toString();
    try {
      const response = await fetch(COORDINATES_SERVER_URI_TEMPLATE.concat(params));
      return response.json();
    } catch (error) {
      console.log("Error during fetch place coordinates", error);
      throw new Error("Error during fetch place coordinates");
    }
  }

  async retrieveWeatherByPlaces(places: Array<Place>): Promise<WeatherFull[]> {   
    const requests: Array<Promise<globalThis.Response>> = this.prepareRequestForEachPlace(places);
    const responses: Array<Response> = await Promise.all(requests);
    const weathers: Array<WeatherFull> = await this.parseResponsesToJson(responses);
    return this.enrichWeatherWithPlaceName(weathers, places);
  }

  // eslint-disable-next-line class-methods-use-this
  parseResponsesToJson(fetchResponse: Array<Response>): Promise<Array<WeatherFull>> {
    return Promise.all(fetchResponse.map((response) => response.json()));
  }

  // eslint-disable-next-line class-methods-use-this
  enrichWeatherWithPlaceName(weathers: Array<WeatherFull>, places: Array<Place>): Array<WeatherFull> {
    for (let i = 0; i < places.length; i++) {
      weathers[i].display_name = places[i].display_name;
    }
    return weathers;
  }

  prepareRequestForEachPlace(places: Array<Place>): Array<Promise<globalThis.Response>> {
    const requsts: Array<Promise<globalThis.Response>> = [];
    for (const place of places) {
      requsts.push(this.prepareRequest(place));
    }
    return requsts;
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  prepareRequest(place: Place): Promise<globalThis.Response> {
    const params = new URLSearchParams({
      latitude: place.lat.toString(),
      longitude: place.lon.toString(),
      current_weather: true.toString(),
      hourly: "temperature_2m,relativehumidity_2m,windspeed_10m"
    }).toString();
    try {
      const request = fetch(WEATHER_SERVER_URI_TEMPLATE.concat(params));
      return request;
    } catch (error) {
      console.log("Error during fetch weather by coordinates", error);
      throw new Error("Error during fetch place coordinates");
    }
  }

}
// Почему не пишется слово function
// Почему везде слово this
// Почему globalThis
// Вопрос по массиву функций
// Вопрос по return в try catch
