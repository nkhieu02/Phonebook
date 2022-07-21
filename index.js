const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.static('build'));
let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
const errorNotes = 
    {
        contentMissing: "Content is missing",
        nameDublicated: "This person alreadyy available"
}
morgan.token('person', (req) => { 
    if (req.method === "POST") { 
        return (
            JSON.stringify(req.body)
        )
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
app.get('/api/persons/', (request, response) => { 
    response.json(notes);
    console.log(request.path);
})
app.get('/info', (req, res) => { 
    const time = new Date();
    const element = `<p> Phonebook has info for ${notes.length} people </p>
                      <p>${time} </p>`
    res.send(element)
})
app.get('/api/persons/:id', (req, res) => { 
    const id = Number(req.params.id);
    console.log(id);
    const person = notes.find(x => x.id === id);
    console.log(person)
    if (!person) { 
        return (
            res.status(404).end()
        )
    }
    res.json(person);
})
app.delete('/api/persons/:id', (req,res) => { 
    const id = Number(req.params.id);
    console.log(id);
    const person = notes.find(x => x.id === id);
    if (!person) { 
        console.log("Person not exist")
        return (
            res.status(204).end()
        )
    }
    notes = [...notes].filter(x => x !== person)
    res.status(204).end();
})
app.use(express.json());
app.post('/api/persons', (req, res) => { 
    const person = req.body;
    console.log()
    const id = notes.length + 1;
    if (person.name && person.number) { 
        if (notes.find(x => x.name === person.name)) { 
            return (
            res.status(400).send(errorNotes.nameDublicated))
        }
        person.id = id;
        notes = notes.concat({ ...person })
        return (
        res.json(person))
    }
    res.status(400).send(errorNotes.contentMissing)
})
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`)
})