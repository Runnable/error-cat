'use strict'

const BaseError = require('./base-error')

/**
 * Error to be thrown or passed when an application encounters a critical/fatal
 * error.
 * @class
 * @extends error-cat:errors~BaseError
 * @author Ryan Sandor Richards
 */
module.exports = class CriticalError extends BaseError {
  /**
   * Creates a new critical error.
   * @param {String} message Message for the error.
   * @param {Object} data Additional data for the error to be given to rollbar.
   */
  constructor (message, data) {
    super(message, data)
    this.setLevel('critical')
  }
}
