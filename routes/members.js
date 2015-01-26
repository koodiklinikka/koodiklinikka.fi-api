'use strict';

var request = require('superagent');
var cache = require('apicache').middleware;

var config = require('../lib/config');

module.exports = function (app) {
  /*
   * POST /members
   * Endpoint for fetching GitHub org members
   */

  app.get('/members', cache('3 hours'), function(req, res, next) {
    request
    .get('https://api.github.com/orgs/koodiklinikka/public_members')
    .set('Authorization', 'token ' + config.github.token)
    .end(function(error, response){
      if(error) {
        return next(error);
      }
      req.apicacheGroup = response.body;
      res.status(200).send(response.body);
    });

  });

};
