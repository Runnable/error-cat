'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const expect = require('code').expect

const WorkerError = require('../../src/errors/worker-error')
const WorkerStopError = require('../../src/errors/worker-stop-error')

describe('errors', () => {
  describe('WorkerStopError', () => {
    it('should extend WorkerError', (done) => {
      const error = new WorkerStopError('some message')
      expect(error).to.be.an.instanceof(WorkerError)
      done()
    })
  }) // end 'WorkerStopError'
}) // end 'errors'
