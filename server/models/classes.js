const mongoose = require('mongoose')
const Schema = mongoose.Schema

const classesSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    class_code: {
        type: String,
        require: true,
        unique: true
    },
    faculty_id: {
        type: Schema.Types.ObjectId,
        ref: "faculties",
        require: true
    }

})

module.exports = mongoose.model('classes', classesSchema)