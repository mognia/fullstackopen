import { useState, useEffect } from 'react'
import axios from 'axios'
import Content from "./components/Content.jsx";

const App = () => {
    const [value, setValue] = useState('')
    const [countries, setCountries] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])

    // Fetch all countries on load
    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    const handleChange = (event) => {
        const searchedCountry = event.target.value
        setValue(searchedCountry)

        const regex = new RegExp(searchedCountry, 'i')
        const filtered = countries.filter(c => regex.test(c.name.common))
        setFilteredCountries(filtered)
    }

    return (
        <div>
            find countries <input value={value} onChange={handleChange} />
            <Content
                countries={filteredCountries}
                setCountries={setFilteredCountries}
            />
        </div>
    )
}

export default App