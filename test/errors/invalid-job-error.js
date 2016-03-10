'use strict'

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.test
var expect = require('code').expect

const WorkerStopError = require('../../errors/worker-stop-error')
const InvalidJobError = require('../../errors/invalid-job-error')

describe('errors', () => {
  describe('InvalidJobError', () => {
    it('should extend WorkerStopError', (done) => {
      const error = new InvalidJobError('some message')
      expect(error).to.be.an.instanceof(WorkerStopError)
      done()
    })
  }) // end 'InvalidJobError'
})
