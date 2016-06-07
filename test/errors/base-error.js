'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const expect = require('code').expect

const BaseError = require('../../lib/errors/base-error')

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

      it('should set reporting', (done) => {
        const reporting = {
          level: 'new-level'
        }
        const error = new BaseError('wowie', {}, reporting)
        expect(error.reporting).to.deep.equal(reporting)
        done()
      })

      it('should set a blank reporting member', (done) => {
        const error = new BaseError('wowie')
        expect(error.reporting).to.deep.equal({})
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
