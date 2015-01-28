'use strict';

var request = require('superagent');
var config = require('../lib/config');
var Promise = require('bluebird');

module.exports = {
  /**
   * Fetch five latest events from GitHub organization
   */
  getEvents: function() {
    return new Promise(function(resolve, reject) {
      request
      .get('https://api.github.com/orgs/koodiklinikka/events?per_page=5')
      .set('Authorization', 'token ' + config.github.token)
      .end(function(error, response){
        if(error) {
          reject(error);
        }

        resolve(response.body);
      });
    });
  }
};
