'use strict';

var Promise = require('bluebird');
var slack = require('../services/slack');
var config = require('../lib/config');
var stripe = require('stripe')(config.stripe.secretKey);

module.exports = function (app) {
  /*
   * POST /membership
   * Endpoint for adding a new member to the association
   */
  app.post('/membership', function(req, res, next) {
    stripe.charges.create({
        amount: 1000,
        currency: 'eur',
        card: req.body.stripeToken,
        description: `Koodiklinikka jäsenyys henkilölle: ${req.body.name}`
    }, function(err, charge) {
      if (err) {
          console.log(JSON.stringify(err, null, 2));

          var message = 'Membership payment FAILED for: ```' + JSON.stringify(req.body) + '``` Reason: ```' + err + '```';
          slack.createMessage(message);

          res.status(500).send({message: 'payment_error'});
          return;
      } else {
        var message = 'Membership payment SUCCESS for: ```' + JSON.stringify(req.body) + '```';
        slack.createMessage(message);
        res.status(200).send({message: 'payment_success'});
      }
    });
  });
};
