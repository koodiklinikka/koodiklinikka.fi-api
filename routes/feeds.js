'use strict';

var request = require('superagent');
var cache = require('apicache').middleware;
var twitter = require('../feeds/twitter');
var github = require('../feeds/github');

module.exports = function (app) {
  /*
   * GET /feeds
   * Endpoint for fetching different information feeds (Twitter, GitHub etc.)
   */
  app.get('/feeds', cache('3 hours'), function(req, res, next) {
    Promise.all([twitter.getTweets(), github.getEvents()]).then(function(data) {
      res.status(200).send(data);
    }, function(err) {
      next(err);
    });
  });
};
