const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lessonsSchema = new Schema({
    subject_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "subjects"
    },
    lecturer_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "staffs"
    },
    date: {
        type: Date,
        require: true
    },
    group_code: {
        type: String,
        require: true
    }

})

module.exports = mongoose.model('lessons', lessonsSchema)