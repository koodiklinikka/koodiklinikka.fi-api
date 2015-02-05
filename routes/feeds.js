'use strict';

var cache = require('apicache').middleware;
var Promise = require('bluebird');
var twitter = require('../services/twitter');
var github = require('../services/github');

module.exports = function (app) {
  /*
   * GET /feeds
   * Endpoint for fetching different information feeds (Twitter, GitHub etc.)
   */
  app.get('/feeds', cache('10 minutes'), function(req, res, next) {
    Promise.props({
      twitter: twitter.getTweets(20),
      github: github.getEvents(20)
    }).then(function(data) {
      res.status(200).send(data);
    }, function(err) {
      next(err);
    });
  });
};
