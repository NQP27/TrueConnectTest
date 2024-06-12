const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chairmansSchema = new Schema({
    chairman_id: {
        type: String,
        require: true
    },
    class_id: {
        type: Schema.Types.ObjectId,
        ref: "classes",
        require: true
    }
})

module.exports = mongoose.model('chairmans', chairmansSchema)