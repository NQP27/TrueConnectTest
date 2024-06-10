const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentsSchema = new Schema({
    person_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "persons"
    },
    class_id: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: "classes"
    },
    student_code: {
        type: String,
        require: true,
    }
})

module.exports = mongoose.model('students', studentsSchema)