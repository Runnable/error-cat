'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const expect = require('code').expect

const cat = require('../lib/index')
const ErrorCat = require('../lib/error-cat')

describe('index', () => {
  it('should expose an ErrorCat instance', (done) => {
    expect(cat).to.be.an.instanceof(ErrorCat)
    done()
  })
})
