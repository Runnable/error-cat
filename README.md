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
const cat = require('error-cat')

// Fire-and-forget error reporting
cat.report(new Error('Something bad'))

// Optionally, pass a callback to execute once the error has been reported
cat.report(new Error('No good'), function () {
  // ...
})
```

## Using error-cat with express
Error cat was designed to be as easy as possible to use with express. Here is an
example of how to do so:

```js
const express = require('express')
const app = express()

// 1. Require error-cat
const cat = require('error-cat')

// 2. Log and report errors using the static responder method
app.use(cat.middleware)
```

## Using error-cat in promise-based applications
Error cat exposes a *pass-through* promise catch handler that will automatically
report and then re-throw errors in a promise chain. Here's how to use it:

```js
Promise
  .try(something)
  .then(somethingElse)
  .catch(cat.catch)
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

#### Extending Error Classes
Each of the error types, detailed below, can be extended for your own application.
Building a robust error zoology is key in correctly implmenting a `try-catch` based
error handling strategy in your application.

Error-cat makes this easy, here's an example of how you can extend the core
base error class to automatically increment an error counter in data-dog (via
[monitor-dog](https://github.com/runnable/monitor-dog)) during construction:

```js
'use strict'

const BaseError = require('error-cat/errors/base-error')
const monitor = require('monitor-dog')

/**
 * Base class for all errors that should be monitored in data-dog.
 * @param  {[type]} message Message for the error.
 * @param  {[type]} data    Custom data to report to rollbar.
 */
class MonitoredError extends BaseError {
  constructor (message, data, reporting) {
    super(message, data, reporting)
    monitor.increment('errors')
  }
}

/**
 * Monitored Error Class
 * @module my-application:error
 */
module.exports = MonitoredError
```

#### class `BaseError(message, data, reporting)` extends `Error`
At the top of the core error hierarchy is `BaseError`. This class provides the
following:

1. An easy-to-use and extendable error class for application programmers
2. Allow for meaningful "extra data"
3. A method of defining how an error should be reported

Here's an example that shows everything the base error has to offer:

```js
const BaseError = require('error-cat/errors/base-error')

// Use it as a normal error...
new BaseError('a message')

// Pass data that should be reported in the constructor...
new BaseError('message', { myData: 123 })

// Pass reporting information on how it should be reported...
new BaseError('message', {}, {
  level: 'critical',      // the reporting level
  fingerprint: 'mygroup'  // a grouping fingerprint
})
```

#### class `Warning(message, data, reporting)` extends `BaseError`
Used to denote an exceptional case that isn't as serious as an error. By default
these types of errors are not reported.

#### class `RouteError(message, statusCode, data, reporting)` extends `BaseError`
Used to denote exceptions that arise during the handling of RESTful routes.
The class is automatically annotated with additional metadata via the
[boom](https://github.com/hapijs/boom) library.

#### class `WorkerError(message, data, reporting, queue, job)` extends `BaseError`
This error class is specifically setup for use in worker servers. It serves as the
root error for the [ponos](https://github.com/runnable/ponos) worker server library.
It specifically sets information about the queue name and the job being processed
when the error occured.

Furthermore it exposes two methods that are used by external worker server libraries
for automatically setting this data when task handlers for workers throw this type
of error:

- (void) `setQueue(name)` - Sets the queue name data
- (void) `setJob(job)` - Sets the job data

#### class `WorkerStopError(message, data, reporting, queue, job)` extends `WorkerError`
Error class that is designed to be thrown when a worker server task handler
encounters a scenario where it cannot possibly proceed with the processing of
the given job. Worker server implementations should automatically acknowledge the
job (even though it was not completed) when encountering this type of error.

#### class `InvalidJobError(message, data, reporting, queue, job)` extends `WorkerStopError`
An error class designed to be thrown when a worker server task handler encounters
a malformed or invalid job.


## Reporters
By default ErrorCat reports errors to rollbar. In order to support other services
the library exposes an `AbstractReporter` class that can be extended as needed.
The only method that is "required" to define in a subclass is `.report`, but the
class has many other methods that can be easily overriden.

A full treatment of building a custom reporter is outside the scope of this document.
We advise that you simply read the `lib/abstract-reporter.js` class file thoroughly
(it is fairly short) to get an understanding how to do so.

For usage reference here is an example of how to implement a custom reporter:
```js
const AbstractReporter = require('error-cat/lib/abstract-reporter')
const ErrorCat = require('error-cat/lib/error-cat')
const noop = require('101/noop')

// 1) Define the reporter...
class ConsoleReporter extends AbstractReporter {
  report (err, cb) {
    if (!this.shouldReport(err)) {
      return (cb || noop)()
    }
    console.error(this.getLevel(err), err.message)
  }
}

// 2) Use it with a custom error-cat instance
const cat = new ErrorCat(new ConsoleReporter('warn'))
```

## Contributing
If you wish to contribute to `error-cat` please adhere to the following rules:

1. Build and read the jsdoc - `npm run doc`
2. Keep test coverage at 100%
3. When building new components, please use the same OOP style as `index.js`
4. For PRs include a good title, and a brief yet informative description of what
   your PR does.

## License
MIT
