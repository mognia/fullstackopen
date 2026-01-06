const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

// 3.7 & 3.8: Use morgan with a custom format string
// We only want to show the body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (req, res) => {
    const count = persons.length;
    const date = new Date();
    const content = `
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
    `

    res.send(content)
})
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find((person) => person.id === id)
    if (person) {
        res.send(person)
    } else {
        res.status(404).send('No such person with id ' + id)
    }
})
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.filter((person) => person.id !== id)

    res.status(204).end()
})
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}
app.post('/api/persons', (request, response) => {
    const body = request.body

    // Check if name or number is missing
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    // Check if name already exists
    const nameExists = persons.find(p => p.name === body.name)
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})