'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const expect = require('code').expect

const CriticalError = require('../../lib/errors/critical-error')

describe('errors', () => {
  describe('CriticalError', () => {
    describe('constructor', () => {
      it('should set the level to critical', (done) => {
        const warning = new CriticalError('Hey there')
        expect(warning.reporting.level).to.equal('critical')
        done()
      })
    }) // end 'constructor'
  }) // end 'CriticalError'
}) // end 'errors'
