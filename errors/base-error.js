'use strict'

const ExtendableError = require('es6-error')
const isObject = require('101/is-object')

/**
 * Extendable base class that includes additional information that effects the
 * way errors are reported to rollbar.
 * @class
 * @author Ryan Sandor Richards
 * @extends es6-error~ExtendableError
 */
module.exports = class BaseError extends ExtendableError {
  /**
   * Creates a new base error.
   * @param {String} message Message for the error.
   * @param {Object} data Additional data for the error to be given to rollbar.
   * @param {Object} reporting Reporting options.
   */
  constructor (message, data, reporting) {
    super(message)
    this.data = isObject(data) ? data : {}
    this.reporting = isObject(reporting) ? reporting : {}
  }

  /**
   * Sets the level at which to report the error.
   * @param {string} level Level at which to report the error to rollbar.
   */
  setLevel (level) {
    this.reporting.level = level
  }

  /**
   * Sets the rollbar grouping fingerprint for the error.
   * @param {string} fingerprint An arbitrary rollbar reporting fingerprint.
   */
  setFingerprint (fingerprint) {
    this.reporting.fingerprint = fingerprint
  }
}