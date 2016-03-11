'use strict'

const WorkerStopError = require('./worker-stop-error')

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
 * @class
 * @module error-cat:errors
 * @extends error-cat:errors~WorkerStopError
 */
module.exports = class InvalidJobError extends WorkerStopError {}
