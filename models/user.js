var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('user', new Schema({
    username: {
        type: String,
        required: 'miss username',
        unique: true,
    },
    password: {
        type: String,
        required: 'miss password',
    },
    group: {
        type: String,
        required: 'miss group',
        enum: ['applicant', 'administrator', 'gatekeeper'],
    }
}));