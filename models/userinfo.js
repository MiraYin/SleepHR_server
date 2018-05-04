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
    }]
});

const UserInfo = mongoose.model('UserInfo',userinfoSchema);
module.exports = UserInfo;