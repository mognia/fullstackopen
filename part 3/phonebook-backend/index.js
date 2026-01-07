const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

// 3.7 & 3.8: Use morgan with a custom format string
// We only want to show the body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error)) // Passes malformatted ID errors to handler
})
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // Check if name already exists
  // const nameExists = persons.find(p => p.name === body.name)
  // if (nameExists) {
  //     return response.status(400).json({
  //         error: 'name must be unique'
  //     })
  // }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {

    response.json(savedPerson)
  }).catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      // Update the fields
      person.name = name
      person.number = number

      // Save the changes - this triggers validation automatically!
      return person.save()
    })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    // 3.19: Return the specific error message from Mongoose
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})