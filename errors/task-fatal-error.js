'use strict'

const TaskError = require('./task-error')

/**
 * Error to be reported by a task handler for a worker. This type of error
 * should cause a worker to acknowledge the job so as to indicate that it
 * cannot be processed.
 *
 * @example
 * // NOTE ponos automatically adds the queue name and job to the error
 * //      in addition to using `ErrorCat.catch` to handle reporting
 * ponosServer.setTask('my-queue', function task(job) {
 * 	 throw new TaskFatalError('Something went terribly wrong...')
 * })
 *
 * @param  {string} message Message for the error.
 * @param  {String} queue   Name of the queue for the worker.
 * @param  {Object} job     The job that was being processed.
 *
 * @class
 * @module error-cat:errors
 * @extends error-cat:errors~TaskError
 */
module.exports = class TaskFatalError extends TaskError {}
