//====LIST DEPENDENCIES===//
const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const webpack = require('webpack');
const Survey = require('./src/models/survey.js');
const UserInfo = require('./src/models/userinfo.js');
var config = require('./webpack.config.dev.js');
const app = express();
const url = 'mongodb://admin:sleephradmin@ds113700.mlab.com:13700/sleephr';
const compiler = webpack(config);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

//To serve static files
app.use('/public', express.static('public'));

//============ROUTING==========//  
//====CREATE NEW USER===//
  app.post('/api/createuser', function(req, res){
    UserInfo.create({
      _id: req.body._id,
      userName: req.body.userName,
    }).then(userinfo => res.json('success'))
  });
  
//====POST NEW SURVEY RESULT api===//
app.post('/api/survey', function(req, res) {
    let recvSurvey = {
        sleepDate: req.body.sleepDate,
        wakeDate: new Date(),
        sleepQuality: parseInt(req.body.sleepQuality),
        stayUp: req.body.stayUp
    }
    if(recvSurvey.stayUp){
        recvSurvey.stayUpReason = req.body.stayUpReason;
    }
    Survey.create(recvSurvey).then(survey => {
        if(survey.stayUp){
            UserInfo.update({_id: req.body._id}, {$set: {longestDays: 0}, $inc:{stayUpDays: 1}, $push: {surveys: survey._id}}).then(() =>
            res.json('success')
        )}else{
            UserInfo.update({_id: req.body._id}, {$inc: {longestDays: 1}, $push: {surveys: survey._id}}).then(() =>
            res.json('success')
        )}
    });
});
  
//======SCORE BOARD api=======//
app.post('/api/scoreboard', function(req, res){
    UserInfo.find({_id: {$in: req.body._ids}}).then(eachOne => {
        res.json(eachOne)
    });    
});

//========REPORT API========//
app.post('/api/report', function(req, res){
  UserInfo.findOne({_id: req.body._id}).populate('surveys').then(one => {
    res.json(one.surveys);
  })  
});


//========SEND WEBSITE=======//
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});


//====MONGOOSE CONNECT===//
mongoose.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
    }
});

//======LISTEN 5000======//
app.listen(process.env.PORT || 5000, function(err) {
  if (err) {
    console.log(err);
    return;
  }
console.log('Listening at http://localhost:5000');
});