const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*===========================
Picture Schema
============================*/

const PictureSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    current: {
        type: Date,
        required: true
    },
    user: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Picture', PictureSchema);