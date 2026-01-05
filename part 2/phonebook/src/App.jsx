import { useState } from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonsForm.jsx";
import Persons from "./components/Persons.jsx";

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    const addName = (event) => {
        event.preventDefault()
        const nameObject = {
            name: newName,
            number: newNumber,
        }
        const nameExists = persons.some(person => person.name === newName)
        if (nameExists) {
            alert(`${newName} is already added to numberbook`)
        }else {
            setPersons(persons.concat(nameObject))
            setNewName('') // Resets the input field
        }
    }

    const personsToShow = filter === ''
        ? persons
        : persons.filter(person =>
            person.name.toLowerCase().includes(filter.toLowerCase())
        )

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />

            <h2>numberbook</h2>
            <PersonForm
                onSubmit={addName}
                nameValue={newName}
                nameOnChange={(e) => setNewName(e.target.value)}
                numberValue={newNumber}
                numberOnChange={(e) => setNewNumber(e.target.value)}
            />
            <h3>Numbers</h3>
            <Persons personsToShow={personsToShow} />
        </div>
    )
}

export default App