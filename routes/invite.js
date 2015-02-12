'use strict';

var validator = require('validator');
var slack = require('../services/slack');

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
      .then(success)
      .catch(function() {
        return slack.createMessage('Invitation request for: ' + req.body.email);
      })
      .then(success)
      .catch(function(err) {
        console.error(err);
        var err = new Error('Creating slack invitation failed');
        return next(err);
      });
  });

};
