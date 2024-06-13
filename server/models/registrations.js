const mongoose = require('mongoose')
const Schema = mongoose.Schema

const registrationsSchema = new Schema({
    subject_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "subjects"
    },
    student_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "students"
    },
    group_code: {
        type: String,
        require: true
    },
    lecturer_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "staffs"
    }

})

module.exports = mongoose.model('registrations', registrationsSchema)