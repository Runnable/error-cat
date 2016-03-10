'use strict'

const BaseError = require('./base-error')

/**
 * Extendable base critical error class.
 * @class
 * @extends error-cat:errors~BaseError
 * @author Ryan Sandor Richards
 */
module.exports = class CriticalError extends BaseError {
  /**
   * Creates a new critical level error. Note that this always sets the report
   * level for the error to 'critical' unless explicitly overriden after
   * instatiation.
   * @param {String} message Message for the error.
   * @param {Object} data Additional data for the error to be given to rollbar.
   * @param {Object} reporting Rollbar reporting options.
   */
  constructor (message, data, reporting) {
    super(message, data, reporting)
    this.setLevel('critical')
  }
}
