import express, {Express, Request, Response} from "express"
import bodyParser from "body-parser"
import { WeatherService } from "./service/WeatherService";

const serverPort: Number = 4000;
const server: Express = express();


server.use(bodyParser.json())

server.post("/weather", (req: Request, res: Response) => {
    let weatherService = new WeatherService();
    weatherService.getWeatherByPlaceName(req.body.cityName)
        .then(weatherData => res.status(200)
            .send(weatherData))//doesn't work without declared promise(manually)
})


server.listen(serverPort, () => {
    console.log(`Example app listening on port ${serverPort}`)
})

         