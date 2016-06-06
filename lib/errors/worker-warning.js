'use strict'

const WorkerError = require('./worker-error')

/**
 * Represents a warning level exception in the context of a worker server.
 * @class
 * @extends error-cat:errors~WorkerError
 * @author Ryan Sandor Richards
 */
module.exports = class WorkerWarning extends WorkerError {
  /**
   * Creates a new WorkerWarning. Note that this always sets a reporting level
   * of warning unless explicitly overriden after instantiation.
   * @param {string} message Message for the warning.
   * @param {object} data Additional data for the warning.
   * @param {string} Name of the queue.
   * @param {object} job Job that caused the warning.
   */
  constructor (message, data, queue, job) {
    super(message, data, queue, job)
    this.setLevel('warn')
  }
}
