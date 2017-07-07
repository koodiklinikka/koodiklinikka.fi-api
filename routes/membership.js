'use strict';

var Promise           = require('bluebird');
var GoogleSpreadsheet = require('google-spreadsheet');
var async             = require('async');
var moment            = require('moment');

var slack   = require('../services/slack');
var config  = require('../lib/config');
var stripe  = require('stripe')(config.stripe.secretKey);


function addNewMemberToSheets(name, email, residence, slackHandle) {
  var doc = new GoogleSpreadsheet(config.google.spreadsheet_id);
  var sheet;

  async.series([
    function setAuth(step) {
      console.log('Start Google Spreadsheed auth.');
      doc.useServiceAccountAuth(config.google.credentials, step);
    },
    function getInfoAndWorksheets(step) {
      console.log('Start Google Spreadsheet info fetch.');
      doc.getInfo(function(err, info) {
        sheet = info.worksheets[0];
        step();
      });
    },
    function addRow(step) {
      console.log('Start Google Spreadsheet row write.');
      sheet.addRow({
        'jäsenmaksu':     true,
        'koko nimi':      name,
        'liittymispäivä': moment().format('DD.MM.YYYY'),
        'lisääjä':        'Koodiklinikka.fi-api',
        'paikkakunta':    residence,
        'slack':          slackHandle,
        'sähköposti':     email
      }, function(err){
        console.log(`Error: ${err}`);
      });
    }
  ], function(err){
      if( err ) {
        console.log(`Error: ${err}`);
      }
  });
}

module.exports = function (app) {
  /*
   * POST /membership
   * Endpoint for adding a new member to the association
   */
  app.post('/membership', function(req, res, next) {
    console.log(`Start membership addition with body: ${JSON.stringify(req.body)}`);

    stripe.charges.create({
        amount:      1000,
        card:        req.body.stripeToken,
        currency:    'eur',
        description: `Koodiklinikka ry jäsenyys: ${req.body.name}`

    }, function(err, charge) {
      if (err) {
        console.log(JSON.stringify(err, null, 2));

        var message = 'Membership payment FAILED for: ```' + JSON.stringify(req.body) + '``` Reason: ```' + err + '```';
        console.log(message);
        slack.createMessage(message);

        res.status(500).send({status_text: 'payment_error'});
        return;

      } else {
        var message = 'Membership payment SUCCESS for: ```' + JSON.stringify(req.body) + '```';
        console.log(message);
        slack.createMessage(message);

        addNewMemberToSheets(req.body.userInfo.name, req.body.userInfo.email, req.body.userInfo.residence, req.body.userInfo.handle);

        res.status(200).send({status_text: 'payment_success'});
        return;

      }
    });
  });
};
