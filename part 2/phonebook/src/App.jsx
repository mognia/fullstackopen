import {useEffect, useState} from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonsForm.jsx";
import Persons from "./components/Persons.jsx";
import Notification from "./components/Notification.jsx";
import personService from './services/persons'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [infoMessage, setInfoMessage] = useState(null)
    const [messageType, setMessageType] = useState('success')
    useEffect(() => {
        personService.getAll().then(initialPersons => {
            setPersons(initialPersons)
        })
    }, [])
    const addName = (event) => {
        event.preventDefault()
        const existingPerson = persons.find(p => p.name === newName)
        if (existingPerson) {
            if (window.confirm(`${newName} is already added, replace the old number with a new one?`)) {
                const changedPerson = { ...existingPerson, number: newNumber }
                personService
                    .update(existingPerson.id, changedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
                        setNewName('')
                        setNewNumber('')
                        setMessageType('success')
                        setInfoMessage(`Updated ${returnedPerson.name}'s number`)
                        setTimeout(() => setInfoMessage(null), 5000)
                    })
                    .catch(() => {
                        // Ex 2.17: Error Notification
                        setMessageType('error')
                        setInfoMessage(`Information of ${newName} has already been removed from server`)
                        setTimeout(() => setInfoMessage(null), 5000)
                        setPersons(persons.filter(p => p.id !== existingPerson.id))
                    })
            }
            return
        }

        const personObject = { name: newName, number: newNumber }
        personService.create(personObject).then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')

            setMessageType('success')
            setInfoMessage(`Added ${returnedPerson.name}`)
            setTimeout(() => setInfoMessage(null), 5000)
        })
    }
    const deletePerson = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            personService.remove(id).then(() => {
                setPersons(persons.filter(p => p.id !== id))
            })
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
            <Notification message={infoMessage} type={messageType} />
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
            <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
        </div>
    )
}

export default App