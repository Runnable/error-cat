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
   */
  constructor (message, data) {
    super(message, data)
    this.setLevel('warn')
  }
}
