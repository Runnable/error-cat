'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach
const it = lab.test
const expect = require('code').expect
const sinon = require('sinon')

const AbstractReporter = require('../lib/abstract-reporter')
const rollbar = require('rollbar')
const RollbarReporter = require('../lib/rollbar-reporter')

describe('RollbarReporter', () => {
  const error = {
    message: 'Some message',
    data: {
      some: 'data',
      req: { some: 'request' }
    },
    reporting: {
      level: 'critical',
      fingerprint: 'wingerprint'
    }
  }
  var reporter

  beforeEach((done) => {
    sinon.stub(rollbar, 'init')
    sinon.stub(rollbar, 'handleErrorWithPayloadData').yieldsAsync()
    reporter = new RollbarReporter()
    done()
  })

  afterEach((done) => {
    rollbar.init.restore()
    rollbar.handleErrorWithPayloadData.restore()
    done()
  })

  describe('class', () => {
    it('should extend AbstractReporter', (done) => {
      expect(reporter).to.be.an.instanceof(AbstractReporter)
      done()
    })
  }) // end 'class'

  describe('canReportToRollbar', () => {
    describe('in test environment', () => {
      it('should return false', (done) => {
        expect(reporter.canReportToRollbar()).to.be.false()
        done()
      })
    }) // end 'in test environment'

    describe('in non-test environment', () => {
      beforeEach((done) => {
        process.env.NODE_ENV = 'non-test'
        done()
      })

      afterEach((done) => {
        process.env.NODE_ENV = 'test'
        done()
      })

      describe('without ROLLBAR_KEY', () => {
        it('should return false', (done) => {
          expect(reporter.canReportToRollbar()).to.be.false()
          done()
        })
      }) // end 'without ROLLBAR_KEY'

      describe('with ROLLBAR_KEY', () => {
        it('should return true', (done) => {
          process.env.ROLLBAR_KEY = 'fake key'
          expect(reporter.canReportToRollbar()).to.be.true()
          delete process.env.ROLLBAR_KEY
          done()
        })
      }) // end 'without ROLLBAR_KEY'
    }) // end 'in non-test environment'
  }) // end 'canReportToRollbar'

  describe('initialize', () => {
    describe('without rollbar availability', () => {
      it('should not initialize rollbar', (done) => {
        reporter.initialize()
        expect(rollbar.init.callCount).to.equal(0)
        done()
      })
    })

    describe('with rollbar availablility', () => {
      beforeEach((done) => {
        process.env.ROLLBAR_KEY = 'key'
        process.env.ROLLBAR_OPTIONS_BRANCH = 'rollbar-branch'
        process.env._VERSION_GIT_COMMIT = 'version-git-commit'
        process.env.ROOT_DIR = 'root-dir'
        sinon.stub(reporter, 'canReportToRollbar').returns(true)
        reporter.initialize()
        done()
      })

      afterEach((done) => {
        delete process.env.ROLLBAR_KEY
        delete process.env.ROLLBAR_OPTIONS_BRANCH
        delete process.env._VERSION_GIT_COMMIT
        delete process.env.ROOT_DIR
        done()
      })

      it('should initialize rollbar', (done) => {
        expect(rollbar.init.calledOnce).to.be.true()
        expect(rollbar.init.calledWith(process.env.ROLLBAR_KEY)).to.be.true()
        expect(rollbar.init.firstCall.args[1]).to.deep.equal({
          environment: process.env.NODE_ENV,
          branch: process.env.ROLLBAR_OPTIONS_BRANCH,
          codeVersion: process.env._VERSION_GIT_COMMIT,
          root: process.env.ROOT_DIR
        })
        done()
      })
    })
  }) // end 'initialize'

  describe('shouldReport', () => {
    describe('without rollbar availability', () => {
      it('should return false', (done) => {
        expect(reporter.shouldReport(error)).to.be.false()
        done()
      })
    })

    describe('with rollbar availability', () => {
      beforeEach((done) => {
        sinon.stub(AbstractReporter.prototype, 'shouldReport')
        sinon.stub(reporter, 'canReportToRollbar').returns(true)
        done()
      })

      it('should not pass the error to the super class', (done) => {
        reporter.shouldReport(error)
        expect(AbstractReporter.prototype.shouldReport.calledOnce).to.be.true()
        expect(AbstractReporter.prototype.shouldReport.calledWith(
          error
        )).to.be.true()
        done()
      })
    })
  }) // end 'shouldReport'

  describe('report', () => {
    describe('when it should not report', () => {
      it('should not handle the payload', (done) => {
        reporter.report(error)
        expect(rollbar.handleErrorWithPayloadData.callCount).to.equal(0)
        done()
      })

      describe('with callback', () => {
        it('should execute the callback', (done) => {
          reporter.report(error, done)
        })
      })
    })

    describe('when it should report', () => {
      beforeEach((done) => {
        sinon.stub(reporter, 'shouldReport').returns(true)
        done()
      })

      it('should handle the payload', (done) => {
        reporter.report(error, () => {
          expect(rollbar.handleErrorWithPayloadData.calledOnce).to.be.true()
          expect(rollbar.handleErrorWithPayloadData.calledWith(
            error
          )).to.be.true()
          expect(rollbar.handleErrorWithPayloadData.firstCall.args[1])
            .to.deep.equal({
              level: error.reporting.level,
              fingerprint: error.reporting.fingerprint,
              custom: error.data
            })
          expect(rollbar.handleErrorWithPayloadData.firstCall.args[2])
            .to.deep.equal(error.data.req)
          done()
        })
      })

      it('should provide empty data when not present', (done) => {
        reporter.report({ message: 'stfunoob' }, () => {
          expect(rollbar.handleErrorWithPayloadData.calledOnce).to.be.true()
          expect(rollbar.handleErrorWithPayloadData.firstCall.args[1])
            .to.deep.equal({
              level: 'error',
              custom: {}
            })
          done()
        })
      })

      it('should add fingerprint when present', (done) => {
        const error = {
          message: 'sucka',
          reporting: {
            fingerprint: 'whoooodoggy'
          }
        }
        reporter.report(error, () => {
          expect(rollbar.handleErrorWithPayloadData.calledOnce).to.be.true()
          expect(rollbar.handleErrorWithPayloadData.firstCall.args[1])
            .to.deep.equal({
              level: 'error',
              fingerprint: error.reporting.fingerprint,
              custom: {}
            })
          done()
        })
      })

      it('should stringify non-string fingerprints', (done) => {
        const error = {
          message: 'sucka',
          reporting: {
            fingerprint: {foo: 'bar'}
          }
        }
        reporter.report(error, () => {
          expect(rollbar.handleErrorWithPayloadData.calledOnce).to.be.true()
          expect(rollbar.handleErrorWithPayloadData.firstCall.args[1])
            .to.deep.equal({
              level: 'error',
              fingerprint: JSON.stringify(error.reporting.fingerprint),
              custom: {}
            })
          done()
        })
      })
    })
  }) // end 'report'
}) // end 'RollbarReporter'
