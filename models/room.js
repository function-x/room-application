var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('room', new Schema({
    name: {
        type: String,
        required: 'miss name',
        unique: true,
    },
    description: {
        type: String,
        default: ''
    },
    gatekeeper: {
        type: Schema.Types.ObjectId,
    }
}));