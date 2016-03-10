'use strict'

const CriticalError = require('../errors/critical-error')
const RollbarReporter = require('./reporters/rollbar')

/**
 * Base class for the error-cat module. Provides methods that allow the end user
 * to report errors, set default reporting levels, and change reporting engines.
 * @class
 * @author Ryan Sandor Richards
 */
class ErrorCat {
  /**
   * Creates a new ErrorCat instance.
   * @param {error-cat:Reporter} [reporter] Reporter used by error-cat to report
   *   errors. Uses the built-in rollbar reporter by default.
   */
  constructor (reporter) {
    // Set the reporter delegate
    if (!reporter) {
      reporter = new RollbarReporter()
      reporter.setReportingLevel('error')
    }
    this.setReporter(reporter)

    // Add bound helper methods
    this['catch'] = this._reportAndThrow.bind(this)
    this['middleware'] = this._reportAndPass.bind(this)
  }

  /**
   * Sets the reporter delegate. The delegate is used to actually perform the
   * specifics of error reporting through error-cat.
   * @see error-cat:reporters~AbstractReporter
   * @param {AbstractReporter} reporter Reporter to use.
   */
  setReporter (reporter) {
    this.reporter = reporter
  }

  /**
   * Promise chain helper method. Add this in a promise.catch to easily report
   * errors via rollbar and then rethrow them for application specific handling.
   *
   * This method is not intended to be used directly, end users should use the
   * `ErrorCat.catch` method in its place (as its binding is fixed to the error
   * cat instance itself).
   *
   * @example
   * return Promise
   *   .try(someErroneousFunction)
   *   .catch(ErrorCat.catch)
   *
   * @param {Error} err The error to report.
   * @throws {Error} Rethrows the error it was given.
   */
  _reportAndThrow (err) {
    this.report(err)
    throw err
  }

  /**
   * Middleware error handler for express applications. Should be one of the
   * last middlewares applied to routes (as it calls res.end).
   *
   * This method is not intended to be used directly, end users should use the
   * `ErrorCat.middleware` method in its place (as its binding is fixed to the
   * error cat instance itself).
   *
   * @param {Error} err Error that occurred.
   * @param {Request} req Request object.
   * @param {Response} res Response object.
   * @param {Function} next Callback to continue the middleware chain.
   */
  _reportAndPass (err, req, res, next) {
    this.report(err, (reportError) => {
      if (reportError) {
        return next(new CriticalError('Unable to report', {
          originalError: reportError
        }))
      }
      next(err)
    })
  }

  /**
   * Reports an error to rollbar.
   * @param {Error} err The error to report.
   * @param {function} [cb] Optional callback to execute after the error has
   *   been reported.
   */
  report (err, cb) {
    this.reporter.report(err, cb)
  }
}

/**
 * A friendly feline companion that helps you report errors.
 * @module error-cat
 * */
module.exports = ErrorCat
