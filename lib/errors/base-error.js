'use strict'

var isObject = require('101/is-object')
var defaults = require('101/defaults')

/**
 * Default values for the report options parameter of the BaseError constructor.
 * @type {Object}
 */
var defaultReportOpts = {
  report: true,
  level: 'error',
  fingerprint: null
}

/**
 * Extendable base class that includes additional information that effects the
 * way errors are reported to rollbar.
 *
 * @param {String} message Message for the error.
 * @param {Object} data Additional data for the error to be given to rollbar.
 * @param {Object} reportOpts Rollbar reporting options.
 * @param {boolean} [reportOpts.report=true] Whether or not to report the error.
 * @param {string} [reportOpts.level=error] Level at which to report the error.
 * @param {string} [reportOpts.fingerprint=null] Custom rollbar grouping
 *   fingerprint.
 *
 * @class
 * @module error-cat:errors
 */
module.exports = function BaseError(message, data, reportOpts) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message

  if (!isObject(data)) {
    data = {}
  }
  this.data = data

  if (!isObject(reportOpts)) {
    reportOpts = {}
  }
  defaults(reportOpts, defaultReportOpts)
  this.report = reportOpts.report
  this.level = reportOpts.level
  this.fingerprint = reportOpts.fingerprint
}
