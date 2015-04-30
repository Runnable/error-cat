'use strict';

require('loadenv')('error-cat:env');
var envIs = require('101/env-is');
var noop = require('101/noop');
var exists = require('101/exists');
var rollbar = require('rollbar');
var autoDebug = require('auto-debug');
var Boom = require('boom');

/**
 * A friendly feline companion that helps you create, track, and report errors.
 * @module error-cat
 * @author Ryan Sandor Richards
 */
module.exports = ErrorCat;

/**
 * Creates a new ErrorCat and initializes rollbar if available.
 */
function ErrorCat () {
  if (this.canUseRollbar()) {
    rollbar.init(process.env.ROLLBAR_KEY, {
      environment: process.env.NODE_ENV,
      branch: process.env.ROLLBAR_OPTIONS_BRANCH,
      codeVersion: process.env._VERSION_GIT_COMMIT,
      root: process.env.ROOT_DIR
    });
  }
  this.debug = autoDebug();
}

/**
 * Determines if the application is using rollbar. Specifically it checks to see
 * if `process.env.ROLLBAR_KEY` is defined, and that the application is not
 * executing under a test environment (i.e. `process.env.NODE_ENV !== 'test'`).
 * @return `true` If ErrorCat should use rollbar, `false` otherwise.
 */
ErrorCat.prototype.canUseRollbar = function () {
  return exists(process.env.ROLLBAR_KEY) && !envIs('test');
};

/**
 * Factory method that creates and logs new boom errors.
 * @param {string} message Message describing the error.
 * @param {mixed} data Additional data for the error.
 * @return {Error} The error object as specified by the parameters.
 */
ErrorCat.prototype.create = function (code, message, data) {
  var err = Boom.create(code, message, data);
  this.log(err);
  return err;
};

/**
 * Responder that sends error information along with a 500 status code.
 * @param {Error} err Error to use for the response.
 * @param {boolean} err.isBoom Indicates whether or not `err` is a boom error.
 * @param {Number} err.output.statusCode Overrides the status code for the
 *   response (only used if `err.isBoom` property is true).
 * @param {object} err.output.payload Overrides the default
 * @param {object} res The response object.
 */
/* jslint unused:false */
ErrorCat.prototype.respond = function (err, req, res, next) {
  res.writeHead(
    err.isBoom ? err.output.statusCode : 500,
    {'Content-Type': 'application/json'}
  );
  res.end(JSON.stringify(
    err.isBoom ? err.output.payload : 'Internal Server Error'
  ));
};

/**
 * Logs errors via debug, and reports them to rollbar.
 * @param {Error} err The error to log.
 */
ErrorCat.prototype.log = function (err) {
  this.debug(err);
  this.report(err);
};

/**
 * Reports errors to rollbar. Note this method is automatically bypassed in test
 * environments (i.e. `process.env.NODE_ENV === 'test'`).
 * @param {Error} err The error to report.
 */
ErrorCat.prototype.report = function (err) {
  if (!exists(err) || err.report === false || !this.canUseRollbar()) {
    return;
  }
  rollbar.handleErrorWithPayloadData(err, { custom: (err.data || {}) }, noop);
};

/**
 * Default ErrorCat Instance.
 * @type {ErrorCat}
 */
var instance = new ErrorCat();

/**
 * Express error responder middleware.
 * @type {function}
 */
Object.defineProperty(ErrorCat, 'middleware', {
  value: instance.respond.bind(instance),
  writable: false,
  enumerable: true
});
