'use strict'

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.test
var expect = require('code').expect

const BaseError = require('../../errors/base-error')

describe('errors', () => {
  describe('BaseError', () => {
    describe('constructor', () => {
      it('should set the given message', (done) => {
        const error = new BaseError('message')
        expect(error.message).to.equal('message')
        done()
      })

      it('without data should set a blank object', (done) => {
        const error = new BaseError('wowie')
        expect(error.data).to.deep.equal({})
        done()
      })

      it('should set the given data', (done) => {
        const data = { foo: 'bar', bam: { biz: 'bop' } }
        const error = new BaseError('wowie', data)
        expect(error.data).to.deep.equal(data)
        done()
      })

      it('without reporting options should set a blank object', (done) => {
        const error = new BaseError('wowie')
        expect(error.reporting).to.deep.equal({})
        done()
      })

      it('should set the given reporting options', (done) => {
        const reporting = { level: 'fatal', fingerprint: 'neato' }
        const error = new BaseError('wowie', null, reporting)
        expect(error.reporting).to.deep.equal(reporting)
        done()
      })
    }) // end 'constructor'

    describe('setLevel', () => {
      it('should set the reporting level', (done) => {
        const error = new BaseError('yo')
        error.setLevel('critical')
        expect(error.reporting.level).to.equal('critical')
        done()
      })
    }) // end 'setLevel'

    describe('setFingerprint', () => {
      it('should set the reporting fingerprint', (done) => {
        const error = new BaseError('wows')
        error.setFingerprint('neats')
        expect(error.reporting.fingerprint).to.equal('neats')
        done()
      })
    }) // end 'setFingerprint'
  }) // end 'BaseError'
}) // end 'errors'
