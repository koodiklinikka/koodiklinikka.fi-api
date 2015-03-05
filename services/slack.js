'use strict';

var request = require('superagent');
var config = require('../lib/config');
var Promise = require('bluebird');

module.exports = {

  /**
   * Create a new Slack - invite
   */

  createInvite: function(email) {
    return new Promise(function(resolve, reject) {
      request
      .post('https://koodiklinikka.slack.com/api/users.admin.invite')
      .field('email', email)
      .field('channels', config.slack.public_channel)
      .field('token', config.slack.token)
      .field('set_active', 'true')
      .end(function(error, response){

        if(!response.body.ok) {
          return reject(response.body.error);
        }

        if(error) {
          return reject(error);
        }

        resolve(response.body);
      });
    });
  },

  /**
   * Send a message to configured channel
   */

  createMessage: function(message) {
    return new Promise(function(resolve, reject) {
      request
      .post('https://koodiklinikka.slack.com/api/chat.postMessage')
      .field('text', message)
      .field('channel', config.slack.private_channel)
      .field('token', config.slack.token)
      .end(function(error, response){
        if(error) {
          reject(error);
        }
        resolve(response.body);
      });
    });
  },
  getUsers: function() {
    return new Promise(function(resolve, reject) {
      request
      .post('https://koodiklinikka.slack.com/api/users.list')
      .field('token', config.slack.token)
      .end(function(error, response){
        if(error) {
          reject(error);
        }
        if(!response.body.ok) {
          return reject(response.body.error);
        }

        resolve(response.body.members);
      });
    });
  }
};
