'use strict';

var validator = require('validator');
var config = require('../lib/config');
var request = require('superagent');


module.exports = function (app) {
  /*
   * POST /invites
   * Endpoint for sending invitations automatically
   */

  app.post('/invites', function(req, res, next) {

    if(!validator.isEmail(req.body.email)) {
      res.status(400).send('Invalid email');
    }

    request
    .post('https://koodiklinikka.slack.com/api/users.admin.invite')
    .field('email', req.body.email)
    .field('channels', config.slack.channels)
    .field('token', config.slack.token)
    .field('set_active', 'true')
    .end(function(error, response){
      if(error) {
        return next(error);
      }

      if(!response.body.ok) {
        var err = new Error('Creating slack invitation failed:', response.body.error);
        return next(err);
      }

      res.status(200).end();
    });

  });

};
