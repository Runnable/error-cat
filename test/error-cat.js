'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.test;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var expect = require('code').expect;
var sinon = require('sinon');
var Boom = require('boom');
var rollbar = require('rollbar');
var ErrorCat = require('../index.js');

describe('ErrorCat', function() {
  describe('interface', function () {
    it('should expose the ErrorCat class', function(done) {
      expect(ErrorCat).to.be.a.function();
      done();
    });
    describe('non test env', function() {
      var NODE_ENV = process.env.NODE_ENV;
      beforeEach(function (done) {
        process.env.NODE_ENV = 'nottest';
        done();
      });

      afterEach(function (done) {
        process.env.NODE_ENV = NODE_ENV;
        done();
      });

      it('should expose an immutable express middleware', function(done) {
        expect(ErrorCat.middleware).to.be.a.function();
        expect(function () {
          ErrorCat.middleware = 'hello';
        }).to.not.throw(); // NOT bc envIs test
        done();
      });

      it('should expose an immutable create method', function(done) {
        expect(ErrorCat.create).to.be.a.function();
        expect(function () {
          ErrorCat.create = 'something else';
        }).to.not.throw(); // NOT bc envIs test
        done();
      });

      it('should expose an immutable log method', function(done) {
        expect(ErrorCat.log).to.be.a.function();
        expect(function () {
          ErrorCat.log = function () {};
        }).to.not.throw(); // NOT bc envIs test
        done();
      });

      it('should expose an immutable report method', function(done) {
        expect(ErrorCat.report).to.be.a.function();
        expect(function () {
          ErrorCat.report = 22;
        }).to.not.throw(); // NOT bc envIs test
        done();
      });
    });
  }); // end 'interface'

  describe('constructor', function() {
    beforeEach(function (done) {
      sinon.stub(rollbar, 'init');
      sinon.stub(ErrorCat.prototype, 'canUseRollbar');
      done();
    });

    afterEach(function (done) {
      rollbar.init.restore();
      ErrorCat.prototype.canUseRollbar.restore();
      done();
    });

    it('should not initialize rollbar when not available', function(done) {
      ErrorCat.prototype.canUseRollbar.returns(false);
      var error = new ErrorCat();
      expect(rollbar.init.calledOnce).to.be.false();
      done();
    });

    it('should initialize rollbar when available', function(done) {
      ErrorCat.prototype.canUseRollbar.returns(true);
      var error = new ErrorCat();
      expect(rollbar.init.calledOnce).to.be.true();
      done();
    });
  }); // end 'constructor'

  describe('canUseRollbar', function () {
    var nodeEnv = process.env.NODE_ENV;
    var rollbarKey = process.env.ROLLBAR_KEY;
    var error = new ErrorCat();

    afterEach(function (done) {
      process.env.NODE_ENV = nodeEnv;
      process.env.ROLLBAR_KEY = rollbarKey;
      done();
    });

    it('should be false in test environment', function(done) {
      process.env.NODE_ENV = 'test';
      process.env.ROLLBAR_KEY = 'somekey';
      expect(error.canUseRollbar()).to.be.false();
      done();
    });

    it('should be false without a rollbar key', function(done) {
      process.env.NODE_ENV = 'production';
      delete process.env.ROLLBAR_KEY;
      expect(error.canUseRollbar()).to.be.false();
      done();
    });

    it('should be true with correct environment and rollbar key ', function(done) {
      process.env.NODE_ENV = 'production';
      process.env.ROLLBAR_KEY = 'somekey';
      expect(error.canUseRollbar()).to.be.true();
      done();
    });
  }); // end 'canUseRollbar'

  describe('create', function() {
    var error = new ErrorCat();

    beforeEach(function (done) {
      sinon.stub(error, 'log');
      sinon.stub(error, 'report');
      sinon.stub(Boom, 'create');
      done();
    });

    afterEach(function (done) {
      error.log.restore();
      error.report.restore();
      Boom.create.restore();
      done();
    });

    it('should create a new boom error', function(done) {
      var code = 400;
      var message = 'Error Message';
      var data = { key: 'value' };
      var expected = new Error('Errorz');
      Boom.create.returns(expected);
      expect(error.create(code, message, data)).to.equal(expected);
      expect(Boom.create.calledOnce).to.be.true();
      expect(Boom.create.calledWith(code, message, data)).to.be.true();
      done();
    });

    it('should log the error', function(done) {
      var err = error.create(400, 'Message', {});
      expect(error.log.calledOnce).to.be.true();
      expect(error.log.calledWith(err)).to.be.true();
      done();
    });

    it('should NOT send the error to rollbar', function(done) {
      var err = error.create(400, 'Message', {});
      expect(error.report.notCalled).to.be.true();
      done();
    });
  }); // end 'create'

  describe('createAndReport', function() {
    var error = new ErrorCat();

    beforeEach(function (done) {
      sinon.stub(error, 'log');
      sinon.stub(error, 'report');
      sinon.stub(Boom, 'create');
      done();
    });

    afterEach(function (done) {
      error.log.restore();
      error.report.restore();
      Boom.create.restore();
      done();
    });

    it('should create a new boom error', function(done) {
      var code = 400;
      var message = 'Error Message';
      var data = { key: 'value' };
      var expected = new Error('Errorz');
      Boom.create.returns(expected);
      expect(error.createAndReport(code, message, data)).to.equal(expected);
      expect(Boom.create.calledOnce).to.be.true();
      expect(Boom.create.calledWith(code, message, data)).to.be.true();
      done();
    });

    it('should log the error', function(done) {
      var err = error.createAndReport(400, 'Message', {});
      expect(error.log.calledOnce).to.be.true();
      expect(error.log.calledWith(err)).to.be.true();
      done();
    });

    describe('without reporting callback', function () {
      it('should send the error to rollbar', function(done) {
        var err = error.createAndReport(400, 'Message', {});
        expect(error.report.calledOnce).to.be.true();
        expect(error.report.calledWith(err)).to.be.true();
        done();
      });
    });

    describe('with reporting callback', function () {
      var myError = new Error('foobar');

      beforeEach(function (done) {
        Boom.create.returns(myError)
        error.report.yieldsAsync(null);
        done();
      });

      it('should callback with new error after reporting', function (done) {
        // calls back with reportedError and generatedError
        error.createAndReport(400, 'Message', {}, function (rErr, gErr) {
          expect(error.report.calledOnce).to.be.true();
          expect(rErr).to.be.null();
          expect(gErr).to.equal(myError);
          done();
        });
      });

      it('should pass back any error reporting error', function (done) {
        var reportingError = new Error('reporting error');
        error.report.yieldsAsync(reportingError);
        error.createAndReport(400, 'Message', {}, function (rErr, gErr) {
          expect(error.report.calledOnce).to.be.true();
          expect(rErr).to.equal(reportingError);
          expect(gErr).to.equal(myError);
          done();
        });
      });
    })
  }); // end 'createAndReport'

  describe('wrap', function() {
    var error = new ErrorCat();

    beforeEach(function (done) {
      sinon.stub(error, 'log');
      sinon.stub(error, 'report');
      sinon.spy(Boom, 'wrap');
      done();
    });

    afterEach(function (done) {
      error.log.restore();
      error.report.restore();
      Boom.wrap.restore();
      done();
    });

    it('should wrap the given error as a boom error', function(done) {
      var err = new Error('Wowza');
      var result = error.wrap(err, 502, 'hello world');
      expect(result.isBoom).to.be.true();
      expect(Boom.wrap.calledOnce).to.be.true();
      expect(Boom.wrap.calledWith(err, 502, 'hello world')).to.be.true();
      done();
    });

    it('should log the error', function(done) {
      var err = new Error('sup');
      var result = error.wrap(err, 404, 'not foundxorz');
      expect(error.log.calledOnce).to.be.true();
      expect(error.log.calledWith(result)).to.be.true();
      done();
    });

    it('should not report the error', function(done) {
      error.wrap(new Error('playa'), 400, 'user errrrr');
      expect(error.report.notCalled).to.be.true();
      done();
    });
  }); // end 'wrap'

  describe('wrapAndReport', function() {
    var error = new ErrorCat();

    beforeEach(function (done) {
      sinon.stub(error, 'log');
      sinon.stub(error, 'report');
      sinon.spy(Boom, 'wrap');
      done();
    });

    afterEach(function (done) {
      error.log.restore();
      error.report.restore();
      Boom.wrap.restore();
      done();
    });

    it('should wrap the given error as a boom error', function(done) {
      var err = new Error('Hello');
      var result = error.wrapAndReport(err, 500, 'supa');
      expect(result.isBoom).to.be.true();
      expect(Boom.wrap.calledOnce).to.be.true();
      expect(Boom.wrap.calledWith(err, 500, 'supa')).to.be.true();
      done();
    });

    it('should log the error', function(done) {
      var result = error.wrapAndReport(new Error('zzz'), 409, 'wowowo');
      expect(error.log.calledOnce).to.be.true();
      expect(error.log.calledWith(result)).to.be.true();
      done();
    });

    it('should report the error', function(done) {
      var result = error.wrapAndReport(new Error('29292'), 599, 'yuss');
      expect(error.report.calledOnce).to.be.true();
      expect(error.report.calledWith(result)).to.be.true();
      done();
    });
  }); // end 'wrapAndReport'

  describe('respond', function() {
    var error = new ErrorCat();

    it('should report normal errors as 500s', function(done) {
      error.respond(new Error(), null, {
        writeHead: function (code) {
          expect(code).to.equal(500);
        },
        end: function (message) {
          expect(message).to.equal('"Internal Server Error"');
          done();
        }
      });
    });

    it('should correctly report boom errors', function(done) {
      var errMessage = 'Errorz!';
      var err = Boom.create(404, errMessage);
      error.respond(err, null, {
        writeHead: function (code) {
          expect(code).to.equal(404);
        },
        end: function (message) {
          message = JSON.parse(message);
          expect(message.message).to.equal(errMessage);
          done();
        }
      });
    });
  }); // end 'respond'

  describe('log', function() {
    var error = new ErrorCat();

    beforeEach(function (done) {
      sinon.stub(error, 'debug');
      sinon.stub(error, 'report');
      done();
    });

    afterEach(function (done) {
      error.debug.restore();
      error.report.restore();
      done();
    });

    it('should log errors with auto-debug', function(done) {
      var err = new Error('Example');
      error.log(err);
      expect(error.debug.calledOnce).to.be.true();
      expect(error.debug.calledWith(err)).to.be.true();
      done();
    });

    it('should NOT report errors', function(done) {
      var err = new Error('Example');
      error.log(err);
      expect(error.report.notCalled).to.be.true();
      done();
    });
  }); // end 'log'

  describe('report', function() {
    var error = new ErrorCat();

    beforeEach(function (done) {
      sinon.stub(rollbar, 'handleErrorWithPayloadData');
      sinon.stub(error, 'canUseRollbar').returns(true);
      done();
    });

    afterEach(function (done) {
      rollbar.handleErrorWithPayloadData.restore();
      error.canUseRollbar.restore();
      done();
    });

    it('should report errors via rollbar', function(done) {
      error.report(new Error());
      expect(rollbar.handleErrorWithPayloadData.calledOnce).to.be.true();
      done();
    });

    it('should report with req if passed', function(done) {
      var req = 'test';
      error.report(new Error(), req);
      expect(rollbar.handleErrorWithPayloadData.firstCall.args[2])
        .to.equal(req);
      done();
    });

    it('should cb if passed', function(done) {
      var req = 'test';
      rollbar.handleErrorWithPayloadData.yieldsAsync();
      error.report(new Error(), req, function () {
        expect(rollbar.handleErrorWithPayloadData.firstCall.args[2])
          .to.equal(req);
        done();
      });
    });

    it('should cb if passed w/o req', function(done) {
      rollbar.handleErrorWithPayloadData.yieldsAsync();
      error.report(new Error(), function () {
        expect(rollbar.handleErrorWithPayloadData.calledOnce).to.be.true();
        done();
      });
    });

    it('should provide error data when available', function(done) {
      var err = new Error();
      err.data = { some: 'data' };
      error.report(err);
      var expected = { custom: err.data };
      expect(rollbar.handleErrorWithPayloadData.firstCall.args[1])
        .to.deep.equal(expected);
      done();
    });

    it('should give empty data when none was provided', function(done) {
      error.report({});
      expect(rollbar.handleErrorWithPayloadData.firstCall.args[1])
        .to.deep.equal({ custom: {} });
      done();
    });

    it('should do nothing when rollbar is unavailable', function(done) {
      error.canUseRollbar.returns(false);
      error.report(new Error());
      expect(rollbar.handleErrorWithPayloadData.callCount).to.equal(0);
      done();
    });

    it('should not report errors if report flag is false', function(done) {
      error.report({ report: false });
      expect(rollbar.handleErrorWithPayloadData.callCount).to.equal(0);
      done();
    });

    it('should not report undefined errors', function (done) {
      error.report(null);
      error.report(undefined);
      expect(rollbar.handleErrorWithPayloadData.callCount).to.equal(0);
      done();
    });
  }); // end 'report'
}); // end 'ErrorCat'
