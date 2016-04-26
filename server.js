'use strict';

require('dotenv').config();
var express = require('express');
var Promise = require('bluebird');
var mongo = Promise.promisifyAll(require("mongodb"));
var routes = require('./app/routes/index.js');

var app = express();

mongo.connect('mongodb://localhost:27017/imagesearch', function (err, db) {

   if (err) {
      throw new Error('Database failed to connect!');
   } else {
      console.log('Successfully connected to MongoDB on port 27017.');
   }

   app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

   routes(app, db);

   app.listen(8080, function () {
      console.log('Node.js listening on port 8080...');
   });

});
