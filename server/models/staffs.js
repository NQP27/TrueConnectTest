const mongoose = require('mongoose')
const Schema = mongoose.Schema

const staffsSchema = new Schema({
    person_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "persons"
    },
    faculty_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "faculties"
    },
    staff_code: {
        type: String,
        require: true
    }

})

module.exports = mongoose.model('staffs', staffsSchema)