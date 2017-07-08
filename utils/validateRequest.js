var Joi = require('joi');

module.exports = function validateRequest(schema) {
  return function handler(req, res, next) {
    Joi.validate(req.body, schema, function (err, value) {
      if(err) {
        return res.status(400).send(err.details)
      }
      next();
    });
  }
}
