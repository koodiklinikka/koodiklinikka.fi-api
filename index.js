'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
require('./routes/invite')(app);

app.use(function(err, req, res, next) {
  console.error(err.message);
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

app.listen(9000);
