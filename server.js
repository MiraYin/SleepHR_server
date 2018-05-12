//====LIST DEPENDENCIES===//
const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
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
app.post('/api/updateuser', function(req, res){
    UserInfo.find({fbid: {$in: req.body.friends}}).then(friends => {
      var friendsID = []
      friends.forEach(function(one){
        friendsID.push(one._id);
      });
      return Promise.all(friendsID );
  }).then((friendsID) => {
    console.log(friendsID);
    console.log(req.body._id);
    UserInfo.findOneAndUpdate({fbid: req.body._id}, {$set: {userName: req.body.userName, friends: friendsID}}, {new: true, upsert: true}, function(err, user){
        res.json('success');  
    })
  })
});
  
//====POST NEW SURVEY RESULT api===//
app.post('/api/survey', function(req, res) {
    let recvSurvey = {
        sleepDate: new Date(parseInt(req.body.sleepDate)),
        wakeDate: new Date(parseInt(req.body.wakeDate)),
        sleepQuality: parseInt(req.body.sleepQuality),
        stayUp: req.body.stayUp
    }
    if(recvSurvey.stayUp){
        recvSurvey.stayUpReason = req.body.stayUpReason;
    }
    Survey.create(recvSurvey).then(survey => {
        if(survey.stayUp){
            UserInfo.update({fbid: req.body._id}, {$set: {longestDays: 0}, $inc:{stayUpDays: 1}, $push: {surveys: survey._id}}).then(() =>
            res.json('success')
        )}else{
            UserInfo.update({fbid: req.body._id}, {$inc: {longestDays: 1, stayUpDays: 0}, $push: {surveys: survey._id}}).then(() =>
            res.json('success')
        )}
    });
});
  
//======SCORE BOARD api=======//
app.post('/api/scoreboard', function(req, res){
    UserInfo.findOne({fbid: req.body.fbid}).populate('friends').then(user => {
        res.json(user)
    });    
});

//========REPORT API========//
app.post('/api/report', function(req, res){
  UserInfo.findOne({fbid: req.body._id}).populate('surveys').then(one => {
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
});