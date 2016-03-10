'use strict'

const AbstractReporter = require('./abstract-reporter')
const envIs = require('101/env-is')
const exists = require('101/exists')
const isFunction = require('101/is-function')
const rollbar = require('rollbar')

/**
 * Reporter for reporting error to Rollbar. Requires the follwoing environment
 * variables:
 *
 * - `ROLLBAR_KEY` - Key for connecting to rollbar
 * - `NODE_ENV` - The node environment at which to report
 * - `ROLLBAR_OPTIONS_BRANCH` - The code branch
 * - `_VERSION_GIT_COMMIT` - The specific commitsh
 * - `ROOT_DIR` - The root directory of the project implementation
 *
 * @class
 * @author Ryan Sandor Richards
 */
class RollbarReporter extends AbstractReporter {
  /**
   * Initializes rollbar reporting.
   * @see error-cat:reporters~AbstractReporter
   */
  initialize () {
    if (!this.canReportToRollbar()) { return }
    rollbar.init(process.env.ROLLBAR_KEY, {
      environment: process.env.NODE_ENV,
      branch: process.env.ROLLBAR_OPTIONS_BRANCH,
      codeVersion: process.env._VERSION_GIT_COMMIT,
      root: process.env.ROOT_DIR
    })
  }

  /**
   * Determines if the application is capable of reporting to rollbar. This
   * equates to whether or not a `process.env.ROLLBAR_KEY` is present in the
   * environment and the `process.evn.NODE_ENV !== 'test'`.
   * @return {boolean} `true` if it is possible to report to rollbar, `false`
   *   otherwise.
   */
  canReportToRollbar () {
    return exists(process.env.ROLLBAR_KEY) && !envIs('test')
  }

  /**
   * @see error-cat:reporters~AbstractReporter
   */
  shouldReport (err) {
    return this.canReportToRollbar() && super.shouldReport(err)
  }

  /**
   * Determines if the error has a custom fingerprint to use for reporting.
   * @param {Error} err Error for which to get the fingerprint.
   * @return {string} The custom fingerprint, if defined. Null otherwise.
   */
  getFingerprint (err) {
    if (!err || !err.reporting) {
      return null
    }
    return err.reporting.fingerprint
  }

  /**
   * @see error-cat:reporters~AbstractReporter
   */
  report (err, cb) {
    // Determine if we should report the error
    if (!this.shouldReport(err)) {
      if (isFunction(cb)) { cb() }
      return
    }

    // Report the error
    const custom = err.data || {}
    rollbar.handleErrorWithPayloadData(err, {
      level: this.getLevel(err),
      fingerprint: this.getFingerprint(err),
      custom: custom
    }, custom.req, cb)
  }
}

/**
 * Reports errors to rollbar.
 * @module error-cat:reporters
 */
module.exports = RollbarReporter
