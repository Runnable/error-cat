'use strict'

var TaskError = require('./task-error')

/**
 * Error to be reported by a task handler for a worker. This type of error
 * should cause a worker to acknowledge the job so as to indicate that it
 * cannot be processed.
 * @param  {string} message Message for the error.
 * @param  {String} queue   Name of the queue for the worker.
 * @param  {Object} job     The job that was being processed.
 */
module.exports = function TaskFatalError(message, queue, job) {
  TaskError.call(message, queue, job)
}
