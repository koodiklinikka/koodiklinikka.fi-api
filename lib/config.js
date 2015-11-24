'use strict';

var _ = require('lodash');
var config = require('../config.json');
var env = process.env.NODE_ENV || 'development';

// TWITTER_CONSUMER_KEY => twitter.consumerKey
function toPath(key) {
  var parts = key.split('_');

  var namespace = parts[0].toLowerCase();
  var option = _.camelCase(_.tail(parts).join('_'))

  return option ? [namespace, option].join('.') : namespace;
}

var envVars = _.reduce(process.env, function(memo, value, key) {
  return _.set(memo, toPath(key), value);
}, {});

module.exports = _.merge({}, config.all, config[env], envVars);
