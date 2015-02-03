'use strict';

var Twitter = require('node-twitter');
var config = require('../lib/config');
var Promise = require('bluebird');

var twitterRestClient = new Twitter.RestClient(
  config.twitter.consumerKey,
  config.twitter.consumerSecret,
  config.twitter.token,
  config.twitter.tokenSecret
);

module.exports = {
  /**
   * Fetch five latest tweets / retweets from Twitter
   */
  getTweets: function(amount) {
    return new Promise(function(resolve, reject) {
      twitterRestClient.statusesUserTimeline({count: amount}, function(error, result) {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }
};
