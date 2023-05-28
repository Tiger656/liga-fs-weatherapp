import express, {Express, Request, Response} from "express";
import bodyParser from "body-parser";
import { WeatherService } from "./service/WeatherService";

const serverPort = 4000;
const server: Express = express();

server.use(bodyParser.json());

server.post("/weather", async (req: Request, res: Response) => {
  const weatherService = new WeatherService();
  const a = await weatherService.getWeatherByPlaceName(req.body.cityName);
  res.status(200).send(a);
});

server.listen(serverPort, () => {
  console.log(`Example app listening on port ${serverPort}`);
});
