const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subjectsSchema = new Schema({
    credits: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true
    },
    subject_code: {
        type: String,
        require: true,
        unique: true

    }
})

module.exports = mongoose.model('subjects', subjectsSchema)