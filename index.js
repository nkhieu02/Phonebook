require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const app = express();
const Person = require("./database/phonebook_data")
const cors = require('cors');
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
const errorHandler = (error, request, response, next) => {
    console.log(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') { 
        return response.status(400).send({error: error.message})
    }
    next(error)
  }
app.use(cors());
app.use(express.static('build'));
app.use(express.json())
/*
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
*/
morgan.token('person', (req) => { 
    if (req.method === "POST") { 
        return (
            JSON.stringify(req.body)
        )
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
app.get('/api/persons/', (request, response, next) => { 
    Person.find({})
        .then((result) => { 
            console.log("Data loaded");
            response.json(result);

        })
    .catch(error => next(error))
})

app.get('/info', (req, res) => { 
    const time = new Date();
    Person
        .count({})
        .then((result) => { 
            const element = `<p> Phonebook has info for ${result} people </p>
                      <p>${time} </p>`
            res.send(element)
        })
})

app.get('/api/persons/:id', (req, res, next) => { 
    const id = req.params.id;
    console.log(id);
    Person
        .findById(id)
        .then(
            (result) => {
                if (!result) {
                    res.status(404).end()
                }
                else { 
                    console.log(`found person with id: ${id}`);               
                    res.json(result);
                }                              
            } )
        .catch(
            (error) => { 
                next(error)
            }
        )
})
app.delete('/api/persons/:id', (req,res,next) => { 
    const id = req.params.id;
    console.log(id);
    Person
        .findByIdAndRemove(id)
        .then(() => { 
            res.status(204).end()
        })
        .catch((error) => { 
            next(error)
        })
})

app.post('/api/persons', (req, res, next) => { 
    const person = req.body;
    const newPerson = new Person({            
        name: person.name,        
        number: person.number,           
    })   
    newPerson
        .save()
        .then(                
        savedNote => {            
            console.log(`Add person with id: ${savedNote._id.toString()}`)            
            res.json(savedNote)           
            })
        .catch(error => next(error))
        
})
app.put('/api/persons/:id', (req, res, next) => { 
    const body = req.body;
    const updateInfor = {
        name: body.name,
        number: body.number,
    }
    Person
        .findByIdAndUpdate(req.params.id, updateInfor, { new: true, runValidator: true, context: 'query' })
        .then(newInfo => { 
            res.json(newInfo);
        })
        .catch(error => { 
            next(error)
        })
    
}
)
app.use(unknownEndpoint);
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`)
})