export type WeatherFull = {
    latitude: Number,
    longitude: Number,
    generationtime_ms: Number,
    utc_offset_seconds: Number,
    timezone: String,
    timezone_abbreviation: String,
    elevation: Number,
    current_weather: {
        temperature: Number,
        windspeed: Number,
        winddirection: Number,
        weathercode: Number,
        is_day: Number,
        time: String
    },
    hourly_units: {
        time: String,
        temperature_2m: String,
        relativehumidity_2m: String,
        windspeed_10m: String
    },
    hourly: {
        time: Array<String>,
        temperature_2m: Array<Number>,
        relativehumidity_2m: Array<Number>,
        windspeed_10m: Array<Number>
    },
    display_name: String
}