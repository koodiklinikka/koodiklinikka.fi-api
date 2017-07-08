'use strict';

var Promise           = require('bluebird');
var GoogleSpreadsheet = require('google-spreadsheet');
var async             = require('async');
var moment            = require('moment');

var slack   = require('../services/slack');
var config  = require('../lib/config');
var stripe  = require('stripe')(config.stripe.secretKey);

function log(message) {
  console.log(message);
  slack.createMessage(message);
}

function addNewMemberToSheets(data, callback) {
  var {name, email, address, postcode, city, handle} = data;
  var doc = new GoogleSpreadsheet(config.google.spreadsheet_id);

  async.waterfall([
    function setAuth(cb) {
      console.log('Start Google Spreadsheed auth.');
      doc.useServiceAccountAuth({
        clientEmail: config.google.clientEmail,
        privateKey: config.google.privateKey
      }, () => cb());
    },
    function getInfoAndWorksheets(cb) {
      console.log('Start Google Spreadsheet info fetch.');
      doc.getInfo(function(err, info) {
        cb(null, info.worksheets[0]);
      });
    },
    function addRow(sheet, cb) {
      console.log('Start Google Spreadsheet row write.');
      sheet.addRow({
        'jäsenmaksu':     true,
        'koko nimi':      name,
        'liittymispäivä': moment().format('DD.MM.YYYY'),
        'lisääjä':        'Koodiklinikka.fi-api',
        'katuosoite':     address,
        'postinumero':    postcode,
        'paikkakunta':    city,
        'slack':          handle,
        'sähköposti':     email
      }, cb);
    }
  ], callback);
}

module.exports = function (app) {
  /*
   * POST /membership
   * Endpoint for adding a new member to the association
   */
  app.post('/membership', function(req, res, next) {
    console.log(`Start membership addition with body: ${JSON.stringify(req.body)}`);

    stripe.charges.create({
        amount:      config.membership.price,
        card:        req.body.stripeToken,
        currency:    'eur',
        description: `Koodiklinikka ry jäsenyys: ${req.body.name}`
    }, function(err, charge) {
      if (err) {
        log(`Membership payment FAILED for: ${JSON.stringify(req.body)}. Reason: ${err.message}`);
        res.status(500).send('payment_error');
        return;
      }

      log(`Membership payment SUCCESSFUL for: ${JSON.stringify(req.body)}`);
      addNewMemberToSheets(req.body.userInfo, (err) => {
        if(err) {
          log(`Storing membership info FAILED for: ${JSON.stringify(req.body)}. Reason: ${err.message}`);
          res.status(500).send('membership_storage_error');
          return;
        }
        res.status(200).send('payment_success');
      });
    });
  });
};
