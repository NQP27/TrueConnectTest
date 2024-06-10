const mongoose = require('mongoose')
const Schema = mongoose.Schema

const classesSchema = new Schema({
    monitor_id: {
        type: Schema.Types.ObjectId,
        ref: "students",
        require: true
    },
    chairman_id: {
        type: Schema.Types.ObjectId,
        ref: "staffs",
        require: true
    },
    name: {
        type: String,
        require: true
    },
    class_code: {
        type: String,
        require: true
    }

})

module.exports = mongoose.model('lasses', classesSchema)