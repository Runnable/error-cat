'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const expect = require('code').expect

const WorkerError = require('../../src/errors/worker-error')
const WorkerWarning = require('../../src/errors/worker-warning')

describe('errors', () => {
  describe('WorkerWarning', () => {
    it('should extend WorkerError', (done) => {
      const warning = new WorkerWarning('some message')
      expect(warning).to.be.an.instanceof(WorkerError)
      done()
    })

    it('should have a reporting level of warn', (done) => {
      const warning = new WorkerWarning('some message')
      expect(warning.reporting.level).to.equal('warn')
      done()
    })
  }) // end 'WorkerWarning'
}) // end 'errors'
