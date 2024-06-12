const mongoose = require('mongoose')
const Schema = mongoose.Schema

const staffsSchema = new Schema({
    person_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "persons",
        unique: true
    },
    faculty_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "faculties"
    },
    staff_code: {
        type: String,
        require: true,
        unique: true
    }

})

module.exports = mongoose.model('staffs', staffsSchema)