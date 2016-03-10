'use strict'

const WorkerError = require('./task-error')

/**
 * Represents a warning level exception in the context of a worker server.
 * @class
 * @extends error-cat:errors~WorkerError
 * @author Ryan Sandor Richards
 */
module.exports = class WorkerWarning extends WorkerError {
  /**
   * Creates a new WorkerWarning. Note that this always sets a reporting level
   * of warning unless explicitly overriden after instatiation.
   * @param {string} message Message for the warning.
   * @param {string} Name of the queue.
   * @param {object} job Job that caused the warning.
   */
  constructor (message, data, reporting, queue, job) {
    super(message, data, reporting, queue, job)
    this.setLevel('warning')
  }
}
