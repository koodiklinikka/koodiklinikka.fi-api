'use strict';

var _ = require('lodash');
var config = {};
const template = require('../config.template.json');

try {
  config = require('../config.json');
} catch(e) {
  console.log('Couldn\'t read config.json file');
}

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

module.exports = _.merge({}, template.development, config.all, config[env], envVars);
