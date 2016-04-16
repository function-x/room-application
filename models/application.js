var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('application', new Schema({
    title: {
        type: String,
        required: 'miss title',
    },
    description: {
        type: String,
        required: 'miss description',
    },
    applicant: {
        type: Schema.Types.ObjectId,
        required: 'miss applicant',
    },
    room: {
        type: Schema.Types.ObjectId,
        required: 'miss room',
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'accepted'],
        default: 'pending',
    },
    passport: {
        type: String,
    }
}));