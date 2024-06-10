const mongoose = require('mongoose')
const Schema = mongoose.Schema

const districtsSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    province_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "provinces"
    },
    district_code: {
        type: String,
        require: true,
        unique: true
    }
})

module.exports = mongoose.model('districts', districtsSchema)