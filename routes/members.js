'use strict';

var github = require('../services/github');
var cache = require('apicache').middleware;

module.exports = function (app) {
  /*
   * POST /members
   * Endpoint for fetching GitHub org public members
   */

  app.get('/members', cache('3 hours'), function(req, res, next) {
    github.getMembers().then(function(data) {
      res.status(200).send(data);
    }, function(error) {
      next(error);
    });
  });
};
