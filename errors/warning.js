'use strict'

const BaseError = require('./base-error')

/**
 * Extendable base warning class.
 * @class
 * @extends error-cat:errors~BaseError
 * @author Ryan Sandor Richards
 */
module.exports = class Warning extends BaseError {
  /**
   * Creates a new warning. Note that this always sets a reporting level of
   * 'warning' unless explicitly overriden after instatiation.
   * @param {String} message Message for the error.
   * @param {Object} data Additional data for the error to be given to rollbar.
   * @param {Object} reporting Rollbar reporting options.
   */
  constructor (message, data, reporting) {
    super(message, data, reporting)
    this.setLevel('warning')
  }
}
