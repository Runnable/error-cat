'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const afterEach = lab.afterEach
const it = lab.test
const expect = require('code').expect

const AbstractReporter = require('../src/abstract-reporter')

describe('AbstractReporter', (done) => {
  const reporter = new AbstractReporter()

  describe('constructor', () => {
    it('should set the given reporting level', (done) => {
      const newReporter = new AbstractReporter('warn')
      expect(newReporter.reportingLevel).to.equal('warn')
      done()
    })
  }) // end 'constructor'

  describe('isValidLevel', () => {
    it('should identify valid levels', (done) => {
      const levels = [
        'trace',
        'debug',
        'info',
        'warn',
        'error',
        'fatal',
        'critical'
      ]
      expect(levels.map(reporter.isValidLevel.bind(reporter)).reduce((a, b) => {
        return a && b
      }, true)).to.be.true()
      done()
    })

    it('should identify invalid levels', (done) => {
      expect(reporter.isValidLevel('not-a-thing')).to.be.false()
      done()
    })
  }) // end 'isValidLevel'

  describe('getLevel', () => {
    it('should return the default when given an null error', (done) => {
      expect(reporter.getLevel()).to.equal('error')
      done()
    })

    it('should return the default without reporting info', (done) => {
      expect(reporter.getLevel({})).to.equal('error')
      done()
    })

    it('should return the default with invalid error level', (done) => {
      expect(reporter.getLevel({ reporting: { level: 'foo' } }))
        .to.equal('error')
      done()
    })

    it('should return the reporting level of the error', (done) => {
      expect(reporter.getLevel({ reporting: { level: 'critical' } }))
        .to.equal('critical')
      done()
    })
  }) // end 'getLevel'

  describe('getFingerprint', () => {
    it('should return null when given a null error', (done) => {
      expect(reporter.getFingerprint()).to.be.null()
      done()
    })

    it('should return null without reporting info', (done) => {
      expect(reporter.getFingerprint({})).to.be.null()
      done()
    })

    it('should error fingerprint', (done) => {
      expect(reporter.getFingerprint({
        reporting: {
          fingerprint: 'neat'
        }
      })).to.equal('neat')
      done()
    })
  }) // end 'getFingerprint'

  describe('getLevelOrder', () => {
    it('should return the correct level orders', (done) => {
      const levelOrders = {
        'critical': 60,
        'fatal': 60,
        'error': 50,
        'warn': 40,
        'info': 30,
        'debug': 20,
        'trace': 10,
        'bogus': 50
      }
      const levels = Object.keys(levelOrders)
      const orders = levels.map((key) => { return levelOrders[key] })
      const result = levels.map(reporter.getLevelOrder.bind(reporter))
      expect(result).to.deep.equal(orders)
      done()
    })
  }) // end 'getLevelOrder'

  describe('shouldReport', () => {
    it('should return false if the error does not exist', (done) => {
      expect(reporter.shouldReport()).to.be.false()
      done()
    })

    it('should return false if the error report level is too low', (done) => {
      expect(reporter.shouldReport({
        reporting: {
          level: 'info'
        }
      })).to.be.false()
      done()
    })

    it('should return true if the error report level is sufficient', (done) => {
      expect(reporter.shouldReport({
        reporting: {
          level: 'error'
        }
      })).to.be.true()
      done()
    })
  }) // end 'shouldReport'

  describe('setReportingLevel', () => {
    afterEach((done) => {
      reporter.reportingLevel = 'error'
      done()
    })

    it('should set the minimum reporting level', (done) => {
      reporter.setReportingLevel('trace')
      expect(reporter.reportingLevel).to.equal('trace')
      done()
    })

    it('with an invalid level should set the minimum at error', (done) => {
      reporter.setReportingLevel('barf')
      expect(reporter.reportingLevel).to.equal('error')
      done()
    })
  }) // end 'setReportingLevel'

  describe('report', () => {
    it('should throw an error', (done) => {
      expect(() => { reporter.report() }).to.throw()
      done()
    })
  }) // end 'report'
}) // end 'AbstractReporter'
