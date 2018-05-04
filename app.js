//====LIST DEPENDENCIES===//
const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const Survey = require('./models/survey.js')
const app = express();
const url = 'mongodb://localhost:27017/CS189';//db named CS189, if not exits, will create one
//=========================//

app.use(bodyParser.json());

//====ROOT DIRECTORY===//
  app.get('/', function(req, res) {
    res.json('you did it');
  });
  //==========================//
  //====GET ALL SIGNATURES===//
  app.get('/api/survey', function(req, res) {
    Survey.find({}).then(eachOne => {
      res.json(eachOne);
      })
    })
  //==========================//
  //====POST NEW SIGNATURE===//
  app.post('/api/survey', function(req, res) {
    Survey.create({
        sleepQuality: req.body.sleepQuality,
        stayUp: (req.body.stayUp === 'true')
    }).then(survey => {
      res.json(survey)
    });
  });
  //==========================//


  //====MONGOOSE CONNECT===//
mongoose.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
    }
   });
   //==========================//


const port = process.env.PORT || 5000;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

app.listen(port, () => console.log(`Listening on port ${port}`));