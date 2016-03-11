'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const expect = require('code').expect

const WorkerStopError = require('../../lib/errors/worker-stop-error')
const InvalidJobError = require('../../lib/errors/invalid-job-error')

describe('errors', () => {
  describe('InvalidJobError', () => {
    it('should extend WorkerStopError', (done) => {
      const error = new InvalidJobError('some message')
      expect(error).to.be.an.instanceof(WorkerStopError)
      done()
    })
  }) // end 'InvalidJobError'
}) // end 'errors'
