'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach
const expect = require('code').expect
const sinon = require('sinon')

const RouteError = require('../../lib/errors/route-error')
const Boom = require('boom')

describe('errors', () => {
  beforeEach((done) => {
    sinon.spy(Boom, 'wrap')
    done()
  })

  afterEach((done) => {
    Boom.wrap.restore()
    done()
  })

  describe('RouteError', () => {
    describe('constructor', () => {
      it('should set the default status code', (done) => {
        const error = new RouteError('whateves')
        expect(Boom.wrap.calledWith(error, 500)).to.be.true()
        done()
      })

      it('should set the given status code', (done) => {
        const error = new RouteError('coolio', 404)
        expect(Boom.wrap.calledWith(error, 404)).to.be.true()
        done()
      })

      it('should set the level to error for 5XX', (done) => {
        const error = new RouteError('yus')
        expect(error.reporting.level).to.equal('error')
        done()
      })

      it('should set the level to warn for 4XX', (done) => {
        const error = new RouteError('neato', 400)
        expect(error.reporting.level).to.equal('warn')
        done()
      })
    }) // end 'constructor'
  }) // end 'RouteError'
}) // end 'errors'
