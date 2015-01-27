'use strict';

var request = require('superagent');
var cache = require('apicache').middleware;
var twitter = require('../feeds/twitter');

module.exports = function (app) {
  /*
   * GET /feeds
   * Endpoint for fetching different information feeds (Twitter, GitHub etc.)
   */
  app.get('/feeds', cache('3 hours'), function(req, res, next) {
    Promise.all([twitter.getTweets()]).then(function(data) {
      res.status(200).send(data);
    });
  });
};
