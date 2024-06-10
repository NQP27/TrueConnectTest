const mongoose = require('mongoose')
const Schema = mongoose.Schema

const personsSchema = new Schema({
    person_code: {
        type: String,
        require: true,
        unique: true
    },
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    citizen_id: {
        type: String,
        unique: true,
        require: true,
    },
    phone: {
        type: String,
        require: true
    },
    sex: {
        type: String,
        require: true
    },
    dob: {
        type: Date,
        require: true
    },
    recent_address: {
        type: String,
        require: true
    },
    ward_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "wards"
    }
})

module.exports = mongoose.model('persons', personsSchema)