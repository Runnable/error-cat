'use strict'

var envIs = require('101/env-is')
var exists = require('101/exists')
var isFunction = require('101/is-function')
var rollbar = require('rollbar')

/**
 * A friendly feline companion that helps you create, track, and report errors
 * via rollbar.
 * @module error-cat
 * @author Ryan Sandor Richards
 */
function ErrorCat() {
  // Expose the provided core error classes
  this.BaseError = require('./errors/base-error')
  this.RouteError = require('./errors/route-error')
  this.TaskError = require('./errors/task-error')
  this.TaskFatalError = require('./errors/task-fatal-error')
  this.JobInvalidError = require('./errors/job-invalid-error')

  // Initialize rollbar
  if (this._canUseRollbar()) {
    rollbar.init(process.env.ROLLBAR_KEY, {
      environment: process.env.NODE_ENV,
      branch: process.env.ROLLBAR_OPTIONS_BRANCH,
      codeVersion: process.env._VERSION_GIT_COMMIT,
      root: process.env.ROOT_DIR
    });
  }
}

/**
 * Determines if the application is using rollbar. Specifically it checks to see
 * if `process.env.ROLLBAR_KEY` is defined, and that the application is not
 * executing under a test environment (i.e. `process.env.NODE_ENV !== 'test'`).
 * @return {Boolean} `true` If ErrorCat should use rollbar, `false` otherwise.
 */
ErrorCat.prototype._canUseRollbar = function () {
  return exists(process.env.ROLLBAR_KEY) && !envIs('test');
};

/**
 * Reports an error to rollbar.
 * @param {Error} err The error to report.
 * @param {Request} [req] Optional request associated with the error.
 * @param {function} [cb] Optional callback to execute after the error has been
 *   reported.
 */
ErrorCat.prototype.report = function (err, req, cb) {
  if (!exists(err) || err.report === false || !this._canUseRollbar()) {
    if (isFunction(cb)) {
      cb()
    }
    return
  }
  if (isFunction(req)) {
    cb = req
    req = null
  }
  rollbar.handleErrorWithPayloadData(err, { custom: (err.data || {}) }, req, cb)
}

/**
 * Reports an error to rollbar.
 * @param {Error} err The error to report.
 * @param {Request} [req] Optional request associated with the error.
 * @return {Promise} Resolves when the error has been reported.
 */
ErrorCat.prototype.reportPromise = function (err, req) {
  return Promise
    .bind(this)
    .fromCallback(function (cb) {
      this.report(err, req, cb)
    })
}

/**
 * Promise chain helper method. Add this in a promise.catch to easily report
 * errors via rollbar.
 * @param {Error} err The error to report.
 * @throws {Error} Rethrows the error it was given.
 */
ErrorCat.prototype.catch = function (err) {
  this.report(err)
  throw err;
}

/**
 * Middleware error handler for express applications. Should be one of the last
 * middlewares applied to routes (as it calls res.end).
 * @param {Error} err Error that occurred.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */
ErrorCat.prototype.middleware = function (err, req, res, next) {
  this.reportWithCallback(err, res, function (reportError) {
    if (reportError) {
      // Well this is awkward...
      // TODO Figure out what we do here...
    }
    res.writeHead(
      err.isBoom ? err.output.statusCode : 500,
      {'Content-Type': 'application/json'}
    )
    res.end(JSON.stringify(
      err.isBoom ? err.output.payload : 'Internal Server Error'
    ))
    next()
  })
}

/**
 * The exposed instance of error-cat
 * @type {ErrorCat}
 */
var instance = module.exports = new ErrorCat()
