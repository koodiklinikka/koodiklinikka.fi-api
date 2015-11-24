require('newrelic');
'use strict';

var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

morgan.token('body', function(req) {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

require('./routes/invite')(app);
require('./routes/members')(app);
require('./routes/feeds')(app);

app.use(function(err, req, res, next) {
  /*jshint unused:false*/
  console.error(err);
  res.status(500).send('Internal server error');
});

app.listen(process.env.PORT || 9000);
