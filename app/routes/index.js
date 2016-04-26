'use strict';

var ApiHandler = require(process.cwd() + '/app/controllers/apiHandler.js');

module.exports = function (app, db) {
   var apiHandler = new ApiHandler(db);
   app.get('/api/imagesearch/:searchTerm', apiHandler.search);
   app.get('/api/latest/imagesearch', apiHandler.latest);
};
