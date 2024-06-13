require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const controlRoute = require('./routes/control')
const authRoute = require('./routes/auth')
const studentRoute = require('./routes/student')
const lecturerRoute = require('./routes/lecturer')


const app = express()
const port = 5000

app.use(express.json())
app.use(controlRoute)
app.use(authRoute)
app.use(studentRoute)
app.use(lecturerRoute)
const connectDB = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017')
        console.log('MongoDB Connected!')

    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

connectDB()


app.get('/', (req, res) => {
    res.send("Hello")
})


app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})