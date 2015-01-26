'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./routes/invite')(app);
require('./routes/members')(app);

app.use(function(err, req, res, next) {
  /*jshint unused:false*/
  console.error(err.message);
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

app.listen(process.env.PORT || 9000);
