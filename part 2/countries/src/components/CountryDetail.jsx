import {useEffect, useState} from "react";
import axios from "axios";

const CountryDetail = ({ country }) => {
    const [weather, setWeather] = useState(null)
    const api_key = import.meta.env.VITE_WEATHER_KEY

    useEffect(() => {
        const lat = country.capitalInfo.latlng[0]
        const lon = country.capitalInfo.latlng[1]
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
            .then(response => {
                setWeather(response.data)
            })
    }, [country, api_key])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>

            <h3>languages:</h3>
            <ul>
                {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
            </ul>
            <img src={country.flags.png} alt="Flag" width="150" />

            {weather && (
                <div>
                    <h3>Weather in {country.capital}</h3>
                    <p>temperature {weather.main.temp} Celsius</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt="weather icon"
                    />
                    <p>wind {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    )
}

export default CountryDetail