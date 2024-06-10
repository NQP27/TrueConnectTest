const mongoose = require('mongoose')
const Schema = mongoose.Schema

const registionSchema = new Schema({
    subject_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "subjects"
    },
    student_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "students"
    }

})

module.exports = mongoose.model('registion', registionSchema)