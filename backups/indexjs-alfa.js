import express from "express"
import bodyParser from "body-parser"

const serverPort = 4000;
const server = express();

server.use(bodyParser.json())

//const  a = https://geocode.maps.co/search?city=Minsk
server.post("/weather", (req, res) => {
    

    let weatherData = 
    getWeatherByCity(req.body.cityName).then(weatherData => res.status(200).send({"status" : "success",
          "cityName": req.body.cityName,
              "temperature": weatherData  }))
    // res.status(200).send({"status" : "success",
    //         "cityName": req.body.cityName,
    //         "temperature": weatherData.current_weather.temperature  })
    // getWeatherByCity(req.body.cityName)
    // .then(weatherData => res.status(200).send({"status" : "success",
    //          "cityName": req.body.cityName,
    //          "temperature": weatherData.current_weather.temperature  }))

 }
        
)


server.listen(serverPort, () => {
    console.log(`Example app listening on port ${serverPort}`)
  })

function getWeatherByCity(cityName) {
    
    // let cityInfo =  getCityCoordinates(cityName)
    // return retrieveWeather(cityInfo)
    return getCityCoordinates(cityName).then(cityInfo => retrieveWeather(cityInfo))
    
    
    
    
}

function getCityCoordinates(cityName) {
    return new Promise((resolve, reject) => {
        console.log('0')
        fetch("https://geocode.maps.co/search?city=" + new URLSearchParams({city: cityName}))
        .then(response => response.json())
        .then(data => {console.log('1')
         resolve(data)});
    })
}
    

async function retrieveWeather(cityInfo) {
    console.log('2')
    //console.log(cityInfo)
    let result = [];
    for(let place of cityInfo) {
        let a = fetch("https://api.open-meteo.com/v1/forecast?" + new URLSearchParams({
        latitude: place.lat,
        longitude: place.lon,
        current_weather: true,
        hourly: "temperature_2m,relativehumidity_2m,windspeed_10m"
        }))
        result.push(a)
        //result.push(createListOfRequests(place))
        // fetch("https://api.open-meteo.com/v1/forecast?" + new URLSearchParams({
        //     latitude: place.lat,
        //     longitude: place.lon,
        //     current_weather: true,
        //     hourly: "temperature_2m,relativehumidity_2m,windspeed_10m"
        //     }))
        // .then(response => response.json()) //???? почему сюда нельзя вставить блок кода. например с консоль лог
        // .then(weatherData => {   
        //     console.log("a")
        //     console.log(weatherData)
        //     result.push(weatherData)
        // })
    }
    //let obj = Promise.all(result).then(data => data);
     Promise.all(result).then(res => {
             //console.log(res);
             Promise.all(res.map((item) => {
                 return item.json();
             }))
             .then(data => console.log(data))
             return res;
         });
    console.log("a");
    //console.log(a);
    //response => response.map(value => value.json())
    // .then(res => {
    //     console.log(res);
    //     Promise.all(res.map((item) => {
    //         return item.json;
    //     }))
    //     .then(data => console.log(data))
    //     return res;
    // });


    //return result;
    
}

function createListOfRequests(place) {
    return () => {
        fetch("https://api.open-meteo.com/v1/forecast?" + new URLSearchParams({
        latitude: place.lat,
        longitude: place.lon,
        current_weather: true,
        hourly: "temperature_2m,relativehumidity_2m,windspeed_10m"
        }))
    } 
    
         //???? почему сюда нельзя вставить блок кода. например с консоль лог
    // .then(weatherData => {   
    //     console.log("a")
    //     console.log(weatherData)
    //     return weatherData;
    // })

}

/*
fetch("https://api.open-meteo.com/v1/forecast?" + new URLSearchParams({
            latitude: place.lat,
            longitude: place.lon,
            current_weather: true,
            hourly: "temperature_2m,relativehumidity_2m,windspeed_10m"
            }))
        .then(response => response.json()) //???? почему сюда нельзя вставить блок кода. например с консоль лог
        .then(weatherData => {   
            console.log("a")
            console.log(weatherData)
            result.push(weatherData)
        })
*/

/*
import express from "express"
import bodyParser from "body-parser"

const serverPort = 4000;
const server = express();

server.use(bodyParser.json())

//const  a = https://geocode.maps.co/search?city=Minsk
server.post("/weather", (req, res) => {
    
  
     getWeatherByCity(req.body.cityName, weatherData => {
            res.status(200).send({"status" : "success",
                "cityName": req.body.cityName,
                "temperature": weatherData.current_weather.temperature  });
            ; 
     })
        
})


server.listen(serverPort, () => {
    console.log(`Example app listening on port ${serverPort}`)
  })

function getWeatherByCity(cityName, callback) {
    //var citiesData;
    return fetch("https://geocode.maps.co/search?city=" + new URLSearchParams({city: cityName}))
    .then(response => response.json())
    .then(data =>
        fetch("https://api.open-meteo.com/v1/forecast?" + new URLSearchParams({
            latitude: data[0].lat,
            longitude: data[0].lon,
            current_weather: true,
            hourly: "temperature_2m,relativehumidity_2m,windspeed_10m"
            }))
        .then(response => response.json()) //???? почему сюда нельзя вставить блок кода. например с консоль лог
        .then(weatherData => {   
            console.log(weatherData)
            callback(weatherData);
                //document.querySelector('#weather').textContent = `Current temperature in ${data.regionName}: ${dataWeather.current_weather.temperature} °C`;
        })
    );
    
}*/
 
