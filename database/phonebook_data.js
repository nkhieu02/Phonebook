const mongoose = require('mongoose');

const URL = process.env.MONGODB_URI;

mongoose
    .connect(URL)
    .then((result) => { 
        console.log("Connect to database")
    })
    .catch((error) => { 
        console.log(error)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
        
});
personSchema.set(
    'toJSON',
    {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject._v
        }
    }
);
const Person = mongoose.model('Person', personSchema);

module.exports = Person;

