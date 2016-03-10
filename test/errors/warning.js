'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const expect = require('code').expect

const Warning = require('../../errors/warning')

describe('errors', () => {
  describe('Warning', () => {
    describe('constructor', () => {
      it('should set the level to warn', (done) => {
        const warning = new Warning('Hey there')
        expect(warning.reporting.level).to.equal('warn')
        done()
      })

      it('should enforce warn level even if overriden', (done) => {
        const warning = new Warning('Hey there', null, { level: 'critical' })
        expect(warning.reporting.level).to.equal('warn')
        done()
      })
    }) // end 'constructor'
  }) // end 'Warning'
}) // end 'errors'
