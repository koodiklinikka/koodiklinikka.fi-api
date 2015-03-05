'use strict';

var request = require('superagent');
var config = require('../lib/config');
var Promise = require('bluebird');

module.exports = {
  /**
   * Fetch five latest events from GitHub organization
   */
  getEvents: function(amount) {
    return new Promise(function(resolve, reject) {
      request
      .get('https://api.github.com/orgs/koodiklinikka/events?per_page=' + amount)
      .set('Authorization', 'token ' + config.github.token)
      .end(function(error, response){
        if(error) {
          reject(error);
        }

        resolve(response.body);
      });
    });
  },
  /**
   * Fetch all the public members of the GitHub organization
   */
  getMembers: function() {
    return new Promise(function(resolve, reject) {
      request
      .get('https://api.github.com/orgs/koodiklinikka/public_members')
      .set('Authorization', 'token ' + config.github.token)
      .end(function(error, response){
        if (error) {
          reject(error);
        }

        resolve(response.body);
      });
    });
  },
  /**
   * Search member by email
   */
  findUserByEmail: function(email) {
    return new Promise(function(resolve, reject) {
      request
      .get('https://api.github.com/search/users')
      .query({q: email})
      .set('Authorization', 'token ' + config.github.token)
      .end(function(error, response){
        if (error) {
          reject(error);
        }
        resolve(response.body);
      });
    });
  }
};
