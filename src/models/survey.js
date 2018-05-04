const mongoose = require('mongoose');
let Schema = mongoose.Schema;

/// SCHEMA SETUP
const surveySchema = new Schema({
  sleepDate:{
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  sleepQuality:{
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  stayUp:{
    type: mongoose.Schema.Types.Boolean,
    required: true,
  },
  stayUpReason:{
    type: mongoose.Schema.Types.String,
    required: false,
  }
})

/// surveySchema is a pattern; Survey is a compiled model with methods
/// Survey.create; Survey.update
const Survey = mongoose.model('Survey',surveySchema);
module.exports = Survey;