'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach
const it = lab.test
const expect = require('code').expect
const sinon = require('sinon')

const WorkerError = require('../../lib/errors/worker-error')

describe('errors', () => {
  describe('WorkerError', () => {
    describe('constructor', () => {
      beforeEach((done) => {
        sinon.spy(WorkerError.prototype, 'setQueue')
        sinon.spy(WorkerError.prototype, 'setJob')
        done()
      })

      afterEach((done) => {
        WorkerError.prototype.setQueue.restore()
        WorkerError.prototype.setJob.restore()
        done()
      })

      it('should set the reporting', (done) => {
        const reporting = {
          level: 'new-level',
          fingerprint: 'new-fingerprint'
        }
        const error = new WorkerError('', {}, reporting)
        expect(error.reporting).to.deep.equal(reporting)
        done()
      })

      it('should pass only allowed reporting fields', (done) => {
        const reporting = {
          level: 'new-level',
          fingerprint: 'new-fingerprint',
          customer: 'Runnable'
        }
        const error = new WorkerError('', {}, reporting)
        expect(error.reporting).to.not.deep.equal(reporting)
        delete reporting.customer
        expect(error.reporting).to.deep.equal(reporting)
        done()
      })

      it('should set the queue name', (done) => {
        const queue = 'neat:stuff'
        const error = new WorkerError('', {}, {}, queue)
        expect(WorkerError.prototype.setQueue.calledWith(queue)).to.be.true()
        expect(error.data.queue).to.equal(queue)
        done()
      })

      it('should set the job', (done) => {
        const job = { type: 'neat:stuff' }
        const error = new WorkerError('', {}, {}, '', job)
        expect(WorkerError.prototype.setJob.calledWith(job)).to.be.true()
        expect(error.data.job).to.deep.equal(job)
        done()
      })
    }) // end 'constructor'

    describe('setQueue', () => {
      it('should set the queue name', (done) => {
        const error = new WorkerError('awesome')
        error.setQueue('parisonfire')
        expect(error.data.queue).to.equal('parisonfire')
        done()
      })
    }) // end 'setQueue'

    describe('setJob', () => {
      it('should set the job', (done) => {
        const job = { awesome: 'sauce' }
        const error = new WorkerError('awesome')
        error.setJob(job)
        expect(error.data.job).to.deep.equal(job)
        done()
      })
    }) // end 'setJob'
  }) // end 'WorkerError'
}) // end 'errors'
