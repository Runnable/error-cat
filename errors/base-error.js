'use strict'

const ExtendableError = require('es6-error')
const defaults = require('101/defaults')
const isObject = require('101/is-object')

/**
 * Default values for the report options parameter of the BaseError constructor.
 * @type {Object}
 */
const defaultReporting = {
  level: 'error',
  fingerprint: null
}

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
   * @param {Object} reporting Rollbar reporting options.
   */
  constructor (message, data, reporting) {
    super(message)
    this.data = isObject(data) ? data : {}
    this.setReportingOptions(reporting)
  }

  /**
   * Determines if the given reporting level is a valid.
   * @param {string} level Reporting level to test.
   * @return {Boolean} `true` if the level is valid, `false` otherwise.
   */
  _isValidReportingLevel (level) {
    return validReportingLevels.contains(level.toString())
  }

  /**
   * Sets the rollbar reporting options for the error.
   * @param {Object} reporting Rollbar reporting options.
   * @param {string} [reporting.level=error] Level at which to report.
   * @param {string} [reporting.fingerprint=null] Custom rollbar grouping
   *   fingerprint.
   */
  setReportingOptions (reporting) {
    this.reporting = pick(isObject(reporting) ? reporting : {}, [
      'level',
      'fingerprint'
    ])
    defaults(this.reporting, defaultReporting)
  }

  /**
   * Sets the level at which to report the error.
   * @param {string} level Level at which to report the error to rollbar.
   */
  setLevel (level) {
    this.reporting.level = this._isValidReportingLevel(level) ? level : 'error'
  }

  /**
   * Sets the rollbar grouping fingerprint for the error.
   * @param {string} fingerprint An arbitrary rollbar reporting fingerprint.
   */
  setFingerprint (fingerprint) {
    this.reporting.fingerprint = fingerprint
  }
}
