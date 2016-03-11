'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const beforeEach = lab.beforeEach
const it = lab.test
const expect = require('code').expect
const sinon = require('sinon')

const ErrorCat = require('../src/error-cat')
const RollbarReporter = require('../src/rollbar-reporter')

describe('ErrorCat', () => {
  var cat

  beforeEach((done) => {
    cat = new ErrorCat()
    sinon.stub(cat.reporter, 'report').yieldsAsync()
    done()
  })

  describe('constructor', () => {
    it('should set the `catch` helper', (done) => {
      const errorCat = new ErrorCat()
      expect(errorCat.catch).to.be.a.function()
      done()
    })

    it('should set the `middleware` helper', (done) => {
      const errorCat = new ErrorCat()
      expect(errorCat.middleware).to.be.a.function()
      done()
    })

    describe('without reporter', () => {
      it('should use the rollbar reporter', (done) => {
        const errorCat = new ErrorCat()
        expect(errorCat.reporter).to.be.an.instanceof(RollbarReporter)
        done()
      })
    }) // end 'without reporter'

    describe('given reporter', () => {
      it('should use the given reporter', (done) => {
        const reporter = { my: 'reporter' }
        const errorCat = new ErrorCat(reporter)
        expect(errorCat.reporter).to.equal(reporter)
        done()
      })
    }) // end 'given reporter'
  }) // end 'constructor'

  describe('setReporter', () => {
    it('should set the reporter', (done) => {
      cat.setReporter('food')
      expect(cat.reporter).to.equal('food')
      done()
    })
  }) // end 'setReporter'

  describe('_reportAndThrow', () => {
    it('should report and rethrow the error', (done) => {
      sinon.stub(cat, 'report')

      var thrownError
      const error = { message: 'weeee' }

      try {
        cat._reportAndThrow(error)
      } catch (err) {
        thrownError = err
      }

      expect(thrownError).to.equal(error)
      expect(cat.report.calledWith(error)).to.be.true()
      done()
    })
  }) // end '_reportAndThrow'

  describe('_reportAndPass', () => {
    const req = { some: 'request' }
    const res = { some: 'response' }

    beforeEach((done) => {
      sinon.stub(cat, 'report').yieldsAsync()
      done()
    })

    it('should set the data if not exists', (done) => {
      const error = { message: 'yus' }
      cat._reportAndPass(error, req, res, (err) => {
        expect(err.data).to.exist()
        done()
      })
    })

    it('should set the data.req if not exists', (done) => {
      const error = { message: 'yus', data: {} }
      cat._reportAndPass(error, req, res, (err) => {
        expect(err.data.req).to.equal(req)
        done()
      })
    })

    describe('on reporting error', () => {
      it('should pass the reporting error', (done) => {
        const reportingError = new Error('booooooom')
        const error = { message: 'weeee' }
        cat.report.yieldsAsync(reportingError)
        cat._reportAndPass(error, req, res, (err) => {
          expect(err).to.equal(reportingError)
          done()
        })
      })
    }) // end 'on reporting error'

    describe('on reporting success', () => {
      it('should pass the original error', (done) => {
        const error = { message: 'weeee', data: { req: req } }
        cat._reportAndPass(error, req, res, (err) => {
          expect(err).to.equal(error)
          done()
        })
      })
    }) // end 'on reporting success'
  }) // end '_reportAndPass'

  describe('report', () => {
    it('should report the error', (done) => {
      const error = { message: 'boo' }
      cat.report(error, () => {
        expect(cat.reporter.report.calledOnce).to.be.true()
        expect(cat.reporter.report.calledWith(error)).to.be.true()
        done()
      })
    })
  }) // end 'report'
}) // end 'ErrorCat'
