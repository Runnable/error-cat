'use strict'

const TaskError = require('./task-error')

/**
 * Represents a warning level exception in the context of a worker server.
 * @class
 * @extends error-cat:errors~TaskError
 * @author Ryan Sandor Richards
 */
class TaskWarning extends TaskError {
  /**
   * Creates a new TaskWarning. Note that this always sets a reporting level of
   * warning unless explicitly overriden after instatiation.
   * @param {string} message Message for the warning.
   * @param {string} Name of the queue.
   * @param {object} job Job that caused the warning.
   */
  constructor (message, queue, job) {
    super(message, job, data)
    this.setLevel('warning')
  }
}
