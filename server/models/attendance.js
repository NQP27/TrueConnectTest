const mongoose = require('mongoose')
const Schema = mongoose.Schema

const attendanceSchema = new Schema({
    lesson_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "lessons"
    },
    is_attended: {
        type: String,
        require: true,
        enum: ["0", "1"]
    },
    student_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "students"
    }

})

module.exports = mongoose.model('attendance', attendanceSchema)