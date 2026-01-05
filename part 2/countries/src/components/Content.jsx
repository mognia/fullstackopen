import CountryDetail from "./CountryDetail.jsx";

const Content = ({ countries, setCountries }) => {
    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    } else if (countries.length === 1) {
        return <CountryDetail country={countries[0]} />
    } else {
        return (
            <div>
                {countries.map(c => (
                    <div key={c.name.common}>
                        {c.name.common}
                        <button onClick={() => setCountries([c])}>show</button>
                    </div>
                ))}
            </div>
        )
    }
}

export default Content