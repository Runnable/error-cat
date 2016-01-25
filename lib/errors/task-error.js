'use strict'

var BaseError = require('./base-error')
var util = require('util')

/**
 * Error to be reported by a task handler for a worker.
 * @param  {string} message Message for the error.
 * @param  {String} queue   Name of the queue for the worker.
 * @param  {Object} job     The job that was being processed.
 */
module.exports = function TaskError(message, queue, job) {
  BaseError.call(this, messsage)
  this.setQueue(queue)
  this.setJob(job)
}

util.inherits(TaskError, BaseError)

/**
 * Sets the queue name for the error.
 * @param {String} queueName Name of the queue.
 */
TaskError.prototype.setQueue = function (queueName) {
  this.data.queue = queueName
}

/**
 * Sets the job for the error.
 * @param {Object} job The job object.
 */
TaskError.prototype.setJob = function (job) {
  this.data.job = job
}
