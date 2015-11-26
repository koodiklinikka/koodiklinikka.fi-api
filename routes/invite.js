'use strict';

var validator = require('validator');
var slack = require('../services/slack');
var github = require('../services/github');

module.exports = function (app) {
  /*
   * POST /invites
   * Endpoint for sending invitations automatically
   */

  app.post('/invites', function(req, res, next) {

    if(!validator.isEmail(req.body.email)) {
      res.status(400).send('Invalid email');
    }

    function success() {
      res.status(200).end();
    }

    slack
      .createInvite(req.body.email)
      .then(function() {
        github
          .findUserByEmail(req.body.email)
          .then(github.inviteToOrg)
          .then(function(user) {
            var message = 'User ' +  user.login + ' invited to GitHub organization.'
            slack.createMessage(message);
          })
          .catch(function(err) {
            var message = 'Creating GitHub invitation failed for: ' + req.body.email + ' reason: ' + err;
            slack.createMessage(message);
          });
      })
      .then(success)
      .catch(function(err) {
        var message = 'Creating automatic invitation failed for: ' + req.body.email + ' reason: ' + err;
        slack.createMessage(message);

        console.error(err);

        var error = new Error('Creating slack invitation failed');
        return next(error);
      });
  });

};
