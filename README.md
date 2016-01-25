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

## Contributing
If you wish to contribute to `error-cat` please adhere to the following rules:

1. Build and read the jsdoc - `npm run doc`
2. Keep test coverage at 100%
3. When building new components, please use the same OOP style as `index.js`
4. For PRs include a good title, and a brief yet informative description of what
   your PR does.

## License
MIT
