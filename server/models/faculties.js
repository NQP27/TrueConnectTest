const mongoose = require('mongoose')
const Schema = mongoose.Schema

const facultiesSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    faculty_code: {
        type: String,
        require: true,
        unique: true
    }

})

module.exports = mongoose.model('faculties', facultiesSchema)