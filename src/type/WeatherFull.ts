export type WeatherFull = {
    latitude: number,
    longitude: number,
    generationtime_ms: number,
    utc_offset_seconds: number,
    timezone: string,
    timezone_abbreviation: string,
    elevation: number,
    current_weather: {
        temperature: number,
        windspeed: number,
        winddirection: number,
        weathercode: number,
        is_day: number,
        time: string
    },
    hourly_units: {
        time: string,
        temperature_2m: string,
        relativehumidity_2m: string,
        windspeed_10m: string
    },
    hourly: {
        time: Array<string>,
        temperature_2m: Array<number>,
        relativehumidity_2m: Array<number>,
        windspeed_10m: Array<number>
    },
    display_name: string
}