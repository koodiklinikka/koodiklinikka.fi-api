'use strict';

var github = require('../services/github');
var cache = require('apicache').middleware;

module.exports = function (app) {
  /*
   * GET /members
   * Endpoint for fetching GitHub org public members
   */
  app.get('/members', cache('3 hours'), function(req, res, next) {
    github.getMembers().then(function(data) {
      res.status(200).send(data);
    }, function(error) {
      next(error);
    });
  });

  /*
   * Post /members
   * Endpoint for getting an invite to GitHub organization
   */
  app.post('/members', function(req, res, next) {
    if(!req.body.username) {
      return res.status(400).send('invalid_username');
    }

    github.inviteToOrg({
      login: req.body.username
    })
    .then(function() {
      res.status(200).end();
    })
    .catch(next);
  });

};
