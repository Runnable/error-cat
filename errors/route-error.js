'use strict'

const BaseError = require('./base-error')
const Boom = require('boom')

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
 * @class
 * @module error-cat:errors
 * @extends error-cat:errors~BaseError
 */
module.exports = class RouteError extends BaseError {
  /**
   * Creates a new route error. Note that this sets the reporting level based
   * on the status code provided. Specifically >= 500 sets 'error' and >= 400
   * sets 'warn'.
   * @param {String} message Message for the error
   * @param {Mixed} statusCode Status code for the route error.
   * @param {Object} data Additional data to be reported.
   * @param {Object} reporting Specific reporting options.
   */
  constructor (message, statusCode, data) {
    super(message, data)
    statusCode = statusCode || 500
    this.setLevel((statusCode >= 500) ? 'error' : 'warn')
    Boom.wrap(this, statusCode)
  }
}
