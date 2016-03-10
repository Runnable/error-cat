'use strict'

const BaseError = require('./base-error')

/**
 * Error to be reported by a task handler for a worker.
 * @class
 * @extends error-cat:errors~BaseError
 * @author Ryan Sandor Richards
 */
module.exports = class TaskError extends BaseError {
  /**
   * Creates a new task error.
   * @param {string} message Message for the error.
   * @param {String} queue   Name of the queue for the worker.
   * @param {Object} job     The job that was being processed.
   */
  constructor (message, queue, job) {
    super(message)
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
