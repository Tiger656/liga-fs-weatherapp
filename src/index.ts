import express, {Express, Request, Response} from "express";
import bodyParser from "body-parser";
import { WeatherService } from "./service/WeatherService";
import { WeatherShort } from "./type/WeatherShort";

const serverPort = 4000;
const server: Express = express();

server.use(bodyParser.json());

server.post("/weather", async (req: Request, res: Response) => {
  const weatherService = new WeatherService();
  const weatherData = await weatherService.getWeatherByPlaceName(req.body.cityName);

  if(req.body.isExtended === true) {
    res.status(200).send(weatherData);
    return;
  }

  const rolledUpData: Array<WeatherShort> = [];
  weatherData.map(fullData => 
    rolledUpData.push({display_name: fullData.display_name,current_temperature: fullData.current_weather.temperature}));
  res.status(200).send(rolledUpData);  
});

server.listen(serverPort, () => {
  console.log(`Example app listening on port ${serverPort}`);
});
