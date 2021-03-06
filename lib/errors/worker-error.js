'use strict'

const BaseError = require('./base-error')

/**
 * Error to be reported by a task handler for a worker.
 * @class
 * @extends error-cat:errors~BaseError
 * @author Ryan Sandor Richards
 */
module.exports = class WorkerError extends BaseError {
  /**
   * Creates a new worker error.
   * @param {String} message Message for the error.
   * @param {Object} data Additional data for the error to be given to rollbar.
   * @param {Object} reporting Optional reporting configuration object.
   * @param {String} reporting.level optional reporting level.
   * @param {String} reporting.fingerprint optional reporting fingerprint.
   * @param {String} queue Name of the queue for the worker.
   * @param {Object} job The job that was being processed.
   */
  constructor (message, data, reporting, queue, job) {
    super(message, data, reporting)
    this.setQueue(queue)
    this.setJob(job)
  }

  /**
   * Sets the queue name for the error.
   * @param {String} queueName Name of the queue.
   */
  setQueue (queueName) {
    this.data.queue = queueName
  }

  /**
   * Sets the job for the error.
   * @param {Object} job The job object.
   */
  setJob (job) {
    this.data.job = job
  }
}
