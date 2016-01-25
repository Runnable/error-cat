'use strict'

var BaseError = require('./base-error')
var Boom = require('boom')
var util = require('util')

/**
 * Error to be thrown from a RESTFul route. Automatically annotates the error
 * via the Boom library.
 *
 * @example
 * app
 *   .get('/users', function (req, res) {
 * 	   throw new RouteError('Bad news', 500)
 *   })
 *   .use(ErrorCat.middleware)
 *
 * @param  {String} message Message for the error
 * @param  {Mixed} statusCode Status code for the route error.
 * @param  {Object} data Additional data to be reported.
 */
module.exports = function RouteError(message, statusCode, data) {
  BaseError.call(this, message, data)
  Boom.wrap(this, statusCode, message)
}

util.inherits(RouteError, BaseError)
