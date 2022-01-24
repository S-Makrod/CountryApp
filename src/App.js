import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({value, onChange}) => <div>Find countries <input value={value} onChange={onChange} /></div>

const Country = ({country}) => {
    const [show, setShow] = useState(false) 
    const handleShowChange = (event) => setShow(!show)

    if(show) {
        return (
            <>
                <p>{country.name.official} <button onClick={handleShowChange}>Hide</button></p>
                <DisplayCountry country={country} />
            </>
        )
    } 
    return (
        <p>{country.name.official} <button onClick={handleShowChange}>Show</button></p>
    )
}

const CountryList = ({country_list}) => <>{country_list.map(country => <Country key={country.name.official} country={country} />)}</>

const Languages = ({languages}) => <>{Object.keys(languages).map(key => <li key={languages[key]}>{languages[key]}</li>)}</>

const Weather = ({weather}) => <>{weather.map(w => <img alt={w.description} key={w.id} src={'http://openweathermap.org/img/w/'+ w.icon +'.png'}/>)}</>

const DisplayCountry = ({country}) => {
    const [weather, setWeather] = useState([]) 

    const toTextualDescription = (degree) => {
        if (degree>337.5) return 'N';
        if (degree>292.5) return 'NW';
        if(degree>247.5) return 'W';
        if(degree>202.5) return 'SW';
        if(degree>157.5) return 'S';
        if(degree>122.5) return 'SE';
        if(degree>67.5) return 'E';
        if(degree>22.5){return 'NE';}
        return 'N';
    }

    useEffect(() =>
        axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + country.capital + '&units=metric&appid=' + process.env.REACT_APP_API_KEY).then(response => setWeather(response.data)
    ), [country])

    if(weather.length === 0) return <p>Loading...</p>

    return (
        <div>
            <h2>{country.name.official}</h2>
            <p><strong>Common Name: {country.name.common}</strong></p>
            <p>Capital: {country.capital}</p>
            <p>Population: {country.population}</p>

            <h3>Languages</h3>
            <ul>
                <Languages languages={country.languages} />
            </ul>
            <img alt={country.name + "flag"} src={country.flags.png}/>

            <h3>Weather in {country.capital}</h3>
            <Weather weather={weather.weather} />
            <p>Temperature: {weather.main.temp} Celsius</p>
            <p>Wind: {weather.wind.speed} km/h {toTextualDescription(weather.wind.deg)}</p>
        </div>
    )
}

function App() {
    const [countries, setCountries] = useState([]) 
    const [filter, setFilter] = useState('')

    const handleFilterChange = (event) => setFilter(event.target.value)
    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all').then(response => setCountries(response.data))
    }, [])

    const countriesToShow = countries.filter(country => country.name.official.toLowerCase().includes(filter.toLowerCase()))

    if (countriesToShow.length > 10){
        return (
            <div>
                <h1>Country Search</h1>
                <Filter value={filter} onChange={handleFilterChange} />
                <p>Too many countries, please specify another filter</p>
            </div>
        )
    } else if (countriesToShow.length === 0) {
        return (
            <div>
                <h1>Country Search</h1>
                <Filter value={filter} onChange={handleFilterChange} />
                <p>No country with that filter!</p>
            </div>
        )
    } else if (countriesToShow.length > 1) {
        return (
            <div>
                <h1>Country Search</h1>
                <Filter value={filter} onChange={handleFilterChange} />
                <CountryList country_list={countriesToShow} />
            </div>
        )
    } else {
        return (
            <div>
                <h1>Country Search</h1>
                <Filter value={filter} onChange={handleFilterChange} />
                <DisplayCountry country={countriesToShow[0]} />
            </div>
        )
    }
}

export default App
