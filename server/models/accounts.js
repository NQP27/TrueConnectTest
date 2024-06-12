const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountsSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    person_id: {
        type: Schema.Types.ObjectId,
        require: true,
        unique: true,
        ref: "persons"
    },
    role: {
        type: String,
        require: true,
        enum: ["SV", "GV", "AD"]
    }
})

module.exports = mongoose.model('accounts', accountsSchema)