# error-cat
[![Build Status](https://travis-ci.org/Runnable/error-cat.svg?branch=master)](https://travis-ci.org/Runnable/error-cat)
[![Dependency Status](https://david-dm.org/Runnable/error-cat.svg)](https://david-dm.org/Runnable/error-cat)
[![devDependency Status](https://david-dm.org/Runnable/error-cat/dev-status.svg)](https://david-dm.org/Runnable/error-cat/dev-status.svg)
[![NPM](https://nodei.co/npm/error-cat.png?compact=true)](https://nodei.co/npm/error-cat)

A friendly feline companion that helps you build error heirarchies and report
application errors to rollbar.

## Basic usage
```js
// Import the library. Uses the environment's `ROLLBAR_KEY` to automatically
// setup rollbar reporting.
var ErrorCat = require('error-cat')

// Fire-and-forget error reporting
ErrorCat.report(new Error('Something bad'))

// Optionally, pass a callback to execute once the error has been reported
ErrorCat.report(new Error('No good'), function () {
  // ...
})

// Pass express requests along to add additional information
ErrorCat.report(error, req)

// Use report in a promise chain (via bluebird)
ErrorCat.reportPromise(error)
  .then(function () {
    // ...
  })
```

## Using error-cat with express
Error cat was designed to be as easy as possible to use with express. Here is an
example of how to do so:

```js
var express = require('express')
var app = express()

// 1. Require error-cat
var ErrorCat = require('error-cat')

// 2. Log and report errors using the static responder method
app.use(ErrorCat.middleware)
```

## Using error-cat in promise-based applications
Error cat exposes a *pass-through* promise catch handler that will automatically
report and then re-throw errors in a promise chain. Here's how to use it:

```js
Promise
  .try(something)
  .then(somethingElse)
  .catch(ErrorCat.catch)
  .catch(function (err) {
    // You'll still need this since `ErrorCat.catch` re-throws the error...
  })
```

## Core Error Classes
Error-cat exposes a set of extendable error classes that are specifically
suited to work with the main library. Application programmers can use these
classes to build their own error hierarchies that allow for higher level
error handling and management.

These error classes are very well suited for Promise based applications (for
use with `.catch`) and `try-catch` based synchronous applications.

In this section we will show you how to use the provided core error classes and
extend them to create your own error zoology.

### Extending Error Classes
Each of the error types, detailed below, can be extended for your own application.
Building a robust error zoology is key in correctly implmenting a `try-catch` based
error handling strategy in your application.

Error-cat makes this easy, here's an example of how you can extend the core
base error class to automatically increment an error counter in data-dog (via
[monitor-dog](https://github.com/runnable/monitor-dog)) during construction:

```js
'use strict'

var BaseError = require('error-cat').BaseError
var monitor = require('monitor-dog')

/**
 * Base class for all errors that should be monitored in data-dog.
 * @param  {[type]} message Message for the error.
 * @param  {[type]} data    Custom data to report to rollbar.
 */
var MonitoredError = function MonitoredError(message, data) {
  BaseError.call(message, data)
  Mon
}
util.inherits(MonitoredError, BaseError)

/**
 * Monitored Error Class
 * @module my-application:error
 */
module.exports = MonitoredError
```

### class `BaseError(message, data)` extends `Error`

```js
var ErrorCat = require('error-cat')

// Report an error as a warning with the given custom data
var myError = new ErrorCat.BaseError('Something wicked...', {
  customRollbarField: 'customValue'
})
myError.level = 'warn'
ErrorCat.report(myError)
```

At the top of the core error hierarchy is `BaseError`. This class has two primary
responsibilities:

1. Provide an easy-to-use and extendable error class for application programmers
2. Set reasonable defaults for various "magic" error properties that are used
   to control information and options when reporting errors to rollbar.

Specifically, the following magic properties are set by base error:

- (boolean) `.report = true` - Used to determine whether or not the error should
  be reported to rollbar. Setting this value to `false` will cause error-cat
  to skip reporting when encounting the error.
- (string) `.level = 'error'` - Sets the level at which the error is reported
  in rollbar. Acceptable values are: `critical`, `error`, `warn`, `info`.
- (string) `.fingerprint = null` - Sets a specific fingerprint by which rollbar
  should group the error. This is very useful for programmatically setting custom
  groupings outside the defaults used in your rollbar configuration
- (object) `.data = {}` - Additional custom data to be reported to rollbar. This
  will default to an empty object literal unless it is set via the `data` argument
  in the `BaseError` constructor.  

### class `RouteError(message, statusCode, data)` extends `BaseError`
Used to denote exceptions that arise during the handling of RESTful routes.
The class is automatically annotated with additional metadata via the
[boom](https://github.com/hapijs/boom) library.

## Contributing
If you wish to contribute to `error-cat` please adhere to the following rules:

1. Build and read the jsdoc - `npm run doc`
2. Keep test coverage at 100%
3. When building new components, please use the same OOP style as `index.js`
4. For PRs include a good title, and a brief yet informative description of what
   your PR does.

## License
MIT
