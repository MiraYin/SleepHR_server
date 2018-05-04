//====LIST DEPENDENCIES===//
const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const Survey = require('./models/survey.js');
const UserInfo = require('./models/userinfo.js');
const app = express();
const url = 'mongodb://admin:sleephradmin@ds113700.mlab.com:13700/sleephr';

//====SETTING====//
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://localhost:3000");/// react front end, try proxy later
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(allowCrossDomain);

//============ROUTING==========//
app.get('/', function(req, res) {
  res.json('undefined');
});

//====GET ALL SURVEY RESULT===//
app.get('/api/survey', function(req, res) {
  UserInfo.findOne({_id: req.body._id}).populate('surveys').then(eachOne => {
    res.json(eachOne);
  })
});

//====POST NEW SURVEY RESULT===//
app.post('/api/survey', function(req, res) {
  let recvSurvey = {
    sleepDate: new Date(),
    sleepQuality: parseInt(req.body.sleepQuality),
    //sleepQuality: parseInt(req.body.sleepQuality),
    stayUp: (req.body.stayUp === 'true')
  }
  if(recvSurvey.stayUp){
    recvSurvey.stayUpReason = req.body.stayUpReason;
  }
  Survey.create(recvSurvey).then(survey => {
    UserInfo.update({_id: req.body._id}, {$push: {surveys: survey._id}}).then(() =>
      res.json('success')
    )
  });
});

//======GET SCORE BOARD=======//
app.get('/api/scoreboard', function(req, res){
  UserInfo.find({_id: {$in: req.body._id}}).then(eachOne => {
    res.json(eachOne);
  })
});

//====MONGOOSE CONNECT===//
mongoose.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
    }
});


//=======START SERVER, LISTENING ON 5000=========//
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));