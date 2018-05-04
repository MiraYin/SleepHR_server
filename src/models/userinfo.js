const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Survey = require('./survey.js')


const userinfoSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    userName: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    surveys: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: false,
    }],
    longestDays: {
        type: mongoose.Schema.Types.Number,
        required: false,
    },
    stayUpDays: {
        type: mongoose.Schema.Types.Number,
        require: false,
    }
});

const UserInfo = mongoose.model('UserInfo',userinfoSchema);
module.exports = UserInfo;