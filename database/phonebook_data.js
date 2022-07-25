const mongoose = require('mongoose');

const URL = process.env.MONGODB_URI;

mongoose
    .connect(URL)
    .then(() => { 
        console.log("Connect to database")
    })
    .catch((error) => { 
        console.log(error)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => {
                return (/\d{2,3}-\d{6,}/.test(v)) // Phone number regrex
             },
            message: props => `${props.value} is not a valid phone number`
        }
    }
        
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

