'use strict';

var request = require('superagent');
var cache = require('apicache').middleware;
var Promise = require('bluebird');
var twitter = require('../feeds/twitter');
var github = require('../feeds/github');

module.exports = function (app) {
  /*
   * GET /feeds
   * Endpoint for fetching different information feeds (Twitter, GitHub etc.)
   */
  app.get('/feeds', cache('3 hours'), function(req, res, next) {
    Promise.props({
      twitter: twitter.getTweets(),
      github: github.getEvents()
    }).then(function(data) {
      res.status(200).send(data);
    }, function(err) {
      next(err);
    });
  });
};
