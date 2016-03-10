'use strict'

const isObject = require('101/is-object')

/**
 * Valid levels for rollbar reporting.
 * @type {array}
 */
const validLevels = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
  'critical'
]

/**
 * Order mapping for valid levels.
 * @type {object}
 */
const levelOrders = {
  'critical': 60,
  'fatal': 60,
  'error': 50,
  'warn': 40,
  'info': 30,
  'debug': 20,
  'trace': 10
}

/**
 * A reporter is a delegate class that performs the actual reporting of errors
 * for error-cat. This class defines an abstract set of methods that *must* be
 * implemented by all reporters in order to be compatible with the ErrorCat
 * base class.
 *
 * Specialized reporters can be easily created for application specific purposes
 * by extending this abstract reporter class and overring the relevant methods.
 *
 * The only method that is strictly abstract is the `report` method. Some come
 * with sensible defaults (e.g. `isValidLevel`, `getLevelOrder`) and others are
 * noops (e.g. `initialize`).
 *
 * @class
 * @abstract
 * @author Ryan Sandor Richards
 */
class AbstractReporter {
  /**
   * Creates a new error reporter with the given minimum reporting level.
   * @param {string} reportingLevel Minimum level at which errors are reported.
   */
  constructor (reportingLevel) {
    this.setReportingLevel(reportingLevel)
  }

  /**
   * Initializes the reporter so that is ready to begin reporting errors. For
   * instance, this method can be used to ensure any 3rd party logging apps
   * are properly setup, etc.
   */
  initialize () {}

  /**
   * Determines if the given error level is valid. The valid error levels are:
   * trace, debug, info, warn, error, critical, and fatal.
   * @param {string} level Level to report.
   * @return {Boolean} `true` if the level is valid, `false` otherwise.
   */
  isValidLevel (level) {
    return validLevels.contains(level)
  }

  /**
   * Detemines a valid reporting level for the given error.
   * @param {Error} err Error to report.
   * @return {string} The level at which the error should be reported.
   */
  getLevel (err) {
    if (!err || !err.reporting || !this.isValidLevel(err.reporting.level)) {
      return this.reportingLevel
    }
    return err.reporting.level
  }

  /**
   * Returns the ordering number for a given level. The ordering number is used
   * to determine if an error of the given level should be reported.
   * @param {string} level Level for which to get the order.
   * @return {integer} The level's order.
   */
  getLevelOrder(level) {
    return levelOrders[ this.isValidLevel(level) ? level : this.reportingLevel ]
  }

  /**
   * Determines whether or not the given error should be reported.
   * @param  {Error} err Error to test.
   * @return {Boolean} `true` if the error should be reported, `false`
   *   otherwise.
   */
  shouldReport (err) {
    if (!err) { return false }
    let order = this.reportingLevel
    if (isObject(err.reporting) && this.isValidLevel(err.reporting.level)) {
      order = this.getLevelOrder(err.reporting.level)
    }
    return order >= this.reportingLevel
  }

  /**
   * Sets the default reporting level for the reporter.
   * @param {string} level Level to set as the minimum default.
   * @throws {InvalidReporterLevelError} If the given reporting level is
   *   invalid.
   */
  setReportingLevel (level) {
    if (!this.isValidLevel(level)) {
      level = 'error'
    }
    this.reportingLevel = this.getLevelOrder(level)
  }

  /**
   * Reports a given error.
   * @abstract
   * @param {Error} err Error to report.
   * @param {function} [cb] Optional callback to execute after the error has
   *   been reported.
   */
  report (err, cb) {
    throw new Error(
      'The AbstractReporter.report method is abstract and must be overriden'
    )
  }
}

/**
 * Abstract reporter base class.
 * @module error-cat:reporters
 */
module.exports = AbstractReporter
