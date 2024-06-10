const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wardsSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    district_id: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: "districts"
    },
    ward_code: {
        type: String,
        require: true,
        unique: true
    }
})

module.exports = mongoose.model('wards', wardsSchema)