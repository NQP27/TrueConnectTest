const mongoose = require('mongoose')
const Schema = mongoose.Schema

const provincesSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    province_code: {
        type: String,
        require: true,
        unique: true
    }
})

module.exports = mongoose.model('provinces', provincesSchema)