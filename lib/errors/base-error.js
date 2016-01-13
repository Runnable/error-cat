'use strict'

var isObject = require('101/is-object')

/**
 * Extendable base class that includes additional information that effects the
 * way errors are reported to rollbar.
 * @param {String} message Message for the error.
 * @param {Object} data Additional data for the error to be given to rollbar.
 */
module.exports = function BaseError(message, data) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message
  this.report = true
  this.level = 'error'
  this.fingerprint = null
  this.data = isObject(data) ? data : {}
}
