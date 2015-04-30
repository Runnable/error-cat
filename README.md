# error-cat
[![Build Status](https://travis-ci.org/Runnable/error-cat.svg?branch=master)](https://travis-ci.org/Runnable/error-cat)
[![Dependency Status](https://david-dm.org/Runnable/error-cat.svg)]](https://david-dm.org/Runnable/error-cat)
[![devDependency Status](https://david-dm.org/Runnable/error-cat/dev-status.svg)](https://david-dm.org/Runnable/error-cat/dev-status.svg)

A friendly feline companion that helps you create errors, track them, and report them via rollbar.

## Using error-cat with express
Error cat was designed to be as easy as possible to use with express. Here is an
example of how to do so:

```js
var express = require('express');
var app = express()

// 1. Require error-cat
var ErrorCat = require('error-cat');

// 2. Log and report errors using the static responder method
app.use(ErrorCat.middleware);
```

## Extending error-cat
Error cat was designed as a prototypal class, so you can easily extend it using
pure javascript:

```js
var util = require('util');
var ErrorCat = require('error-cat');

//
// 1. Define your own ErrorCat class
//
function MyErrorCat() {
  ErrorCat.apply(this, arguments);
}
util.inherits(MyErrorCat, ErrorCat);

MyErrorCat.prototype.respond = function (err, req, res) {
  // Custom middleware...
};

MyErrorCat.prototype.report = function (err, req, res) {
  // Perhaps you want to report errors to more than just rollbar?
};


//
// 2. Use an instance with an application
//
var express = require('express');
var app = express();
var error = new MyErrorCat();
app.use(error.respond);
```
## API

The `error-cat` module exposes a single class named `ErrorCat`. Below is a
complete listing of its methods.

#### ErrorCat.middleware(err, req, res, next)
An express middleware that can be used to handle error responses with
`error-cat` (uses the method `respond` detailed in the next section).

Note, this static method is set as `writable: false`, and will throw an error
if you attempt to assign it a different value. If you need to change the default
behavior please see the `Extending error-cat` section above.

### ErrorCat Methods

#### {ErrorCat} `new ErrorCat()`
Constructs a new `ErrorCat` instance and initializes Rollbar if it is available.

#### {boolean} `canUseRollbar()`
Determines whether or not ErrorCat can use Rollbar to report errors. This method
will return `true` if, and only if, `process.env.NODE_ENV !== 'test'` and
`process.env.ROLLBAR_KEY` is defined.

Note: Error cat uses the [loadenv](http://www.npmjs.com/package/loadenv) package
to load the environment so feel free to use its conventions to define
`ROLLBAR_KEY`.

#### {Boom~Error} `create(code, message, data)`
Creates and automatically logs a new [boom](https://www.npmjs.com/package/boom)
via the `ErrorCat.log` method (see below). The parameters mirror `Boom.create`.

#### {void} `log(err)`
Logs the given error using [auto-debug](https://www.npmjs.com/package/auto-debug)
and reports it to rollbar via `ErrorCat.report` (see below).

#### {void} `report(err)`
Reports the given error via Rollbar. This method is automatically bypassed if
`ErrorCat.canUseRollbar()` returns false (see above).

## Contributing
If you wish to contribute to `error-cat` please adhere to the following rules:

1. Build and read the jsdoc - `npm run doc`
2. Keep test coverage at 100%
3. When building new components, please use the same OOP style as `index.js`
4. For PRs include a good title, and a brief yet informative description of what
   your PR does.

## License
MIT
