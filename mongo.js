const mongoose = require('mongoose');
const len = process.argv.length;
if (len < 3) { 
    console.log("Missing argument");
    process.exit(1);
}

const password = process.argv[2];
const baseURL = `mongodb+srv://nkhieu100602:${password}@cluster0.gp0ou.mongodb.net/phonebook?retryWrites=true&w=majority`



const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)
if (len == 3) { 
    mongoose
        .connect(baseURL)
        .then((result) => { 
            Person.find({}).then(result => {l
                result.forEach(person => { 
                    console.log(person)
                })
                mongoose.connection.close()
            })
        }
    )
    }
if (len == 5) {
    mongoose
        .connect(baseURL)
        .then((result) => {
            console.log('connected')
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            }
            )
            return person.save()
        })
        .then(
            () => {
                console.log("person saved")
                return mongoose.connection.close()
            }
        )
        .catch((err) => console.log(err))
}
