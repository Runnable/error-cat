'use strict'

const WorkerError = require('./worker-error')

/**
 * Error to be reported by a task handler for a worker. This type of error
 * should cause a worker to acknowledge the job so as to indicate that it
 * cannot be processed.
 *
 * @example
 * // NOTE ponos automatically adds the queue name and job to the error
 * //      in addition to using `ErrorCat.catch` to handle reporting
 * ponosServer.setTask('my-queue', function task(job) {
 * 	 throw new WorkerStopError('Something went terribly wrong...')
 * })
 *
 * @param {String} message Message for the error.
 * @param {Object} data Additional data for the error to be given to rollbar.
 * @param {Object} reporting Reporting options.
 * @param {String} queue Name of the queue for the worker.
 * @param {Object} job The job that was being processed.
 *
 * @class
 * @module error-cat:errors
 * @extends error-cat:errors~WorkerError
 */
module.exports = class WorkerStopError extends WorkerError {}
