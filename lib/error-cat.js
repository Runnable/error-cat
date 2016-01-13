'use strict'

var envIs = require('101/env-is')
var exists = require('101/exists')
var isFunction = require('101/is-function')
var rollbar = require('rollbar')

var BaseError = require('./errors/base-error')
var RouteError = require('./errors/route-error')
var TaskError = require('./errors/task-error')
var TaskFatalError = require('./errors/task-fatal-error')

/**
 * A friendly feline companion that helps you create, track, and report errors
 * via rollbar.
 * @module error-cat
 * @author Ryan Sandor Richards
 */
function ErrorCat() {
  if (this.canUseRollbar()) {
    rollbar.init(process.env.ROLLBAR_KEY, {
      environment: process.env.NODE_ENV,
      branch: process.env.ROLLBAR_OPTIONS_BRANCH,
      codeVersion: process.env._VERSION_GIT_COMMIT,
      root: process.env.ROOT_DIR
    });
  }
  if (this.canReportUncaughtExceptions()) {
    // TODO Implement me!!!
  }
}

/**
 * Determines if the application is using rollbar. Specifically it checks to see
 * if `process.env.ROLLBAR_KEY` is defined, and that the application is not
 * executing under a test environment (i.e. `process.env.NODE_ENV !== 'test'`).
 * @return {Boolean} `true` If ErrorCat should use rollbar, `false` otherwise.
 */
ErrorCat.prototype.canUseRollbar = function () {
  return exists(process.env.ROLLBAR_KEY) && !envIs('test');
};

/**
 * TODO Document me in the readme
 * Determines if ErrorCat should automatically report uncaught exceptions to
 * rollbar. By default ErrorCat **will do so**, to turn this behavior off use
 * the following in your environment configuration:
 *
 *   ROLLBAR_REPORT_UNCAUGHT=no
 *
 * Uncaught exceptions are **never** reported if `NODE_ENV` is set to `test`.
 */
ErrorCat.prototype.canReportUncaughtExceptions = function () {
  var envReport = process.env.ROLLBAR_REPORT_UNCAUGHT;
  return !envIs('test') && envReport !== 'no' && envReport !== 'false';
}

/**
 * Reports errors to rollbar. Note this method is automatically bypassed in test
 * environments (i.e. `process.env.NODE_ENV === 'test'`).
 * @param {Error} err The error to report.
 * @param {object} [req] optional request to report.
 * @return {Promise} A promise that resolves when the error has been reported.
 */
ErrorCat.prototype.report = function (err, req) {
  if (!exists(err) || err.report === false || !this.canUseRollbar()) {
    return Promise.resolve();
  }
  var data = { custom: (err.data || {}) }
  return Promise.fromCallback(function (cb) {
    rollbar.handleErrorWithPayloadData(err, data req, cb);
  })
};

/**
 * Callback friendly `report` method.
 * @see `ErrorCat.prototype.report`
 * @param {Error} err The error to report.
 * @param {object} [req] optional request to report.
 * @param  {Function} cb  Callback to execute once the the error has been
 *   reported.
 */
ErrorCat.prototype.reportWithCallback = function (err, req, cb) {
  if (isFunction(req)) {
    cb = req
    req = undefined
  }
  this.report.asCallback(cb)
}
