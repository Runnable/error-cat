'use strict'

var TaskFatalError = require('./task-fatal-error')
var util = require('util')

/**
 * Error that should be thrown when a worker job is found to be invalid.
 *
 * @example
 * function taskHandler(job) {
 *   if (!isString(job.id)) {
 *     throw new InvalidJobError('Job missing `id` of type {string}')
 *   }
 *   if (isEmpty(job.id)) {
 *   	 throw new InvalidJobError('Job requires non-empty `id`')
 *   }
 * }
 *
 * @param  {string} message Message for the error.
 * @param  {String} queue   Name of the queue for the worker.
 * @param  {Object} job     The job that was being processed.
 */
module.exports = function InvalidJobError(message, job, data) {
  TaskFatalError.call(this, message, job, data)
}

util.inherits(InvalidJobError, TaskFatalError)
