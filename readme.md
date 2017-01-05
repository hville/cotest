<!-- markdownlint-disable MD004 MD007 MD010 MD041 MD022 MD024 MD032 -->
# cotest

*yet another unit test assertion and test runner* -
***small, simple, no dependencies***

![ScreenCap](./cotest.gif)

• [Why](#why) • [What](#what) • [How](#how) • [License](#license) •

# Why

This originated as an attempt to have assertions that are less verbose because `assert.notDeepStrictEqual` is ugly
(just try in other languages to get that first time feel once again: `verifier.nonEgaliteRecursiveStricte`)

Package [tt](https://www.npmjs.com/package/tt) was used as a start and was modified considerably to change the API.

# What

## Example

```javascript
const t = require('cotest')

co('1. primitives - comparison', function() {
  co('==', 2, 2)
  co('!==', 3, 4, 'should be unequal')
  co('<', 1, 2)
  co('!', null, 'should be falsy')
  t.skip('>=', 55, 0, 'TODO')
})
co('2. object - comparison', function() {
  co('!{===}', [], 'str', 'should be notDeepStrictEqual')
  co('{==}', [2], 2, 'should be deepEqual')
})
co('3. async', function(end) {
  setTimeout(end, 0)
  co('!==', 3, 4)
  co('!{==}', 3, 4)
})
co.skip('4. skip', function() {
  // all tests defined here will be skipped
}, 'to be defined')
```

## Features

* Javascript Comparison Operators (`==`, `!==`, `===`, `!===`, `<`, `<=`, `>`, `>=`)
* Negation (`!`, `!!`)
* Other symbols for nested object
  * `{==}`: deepEqual
  * `!{==}`: notDeepEqual
  * `{===}`: strictDeepEqual
  * `!{===}`: notStrictDeepEqual
* Async support
* Skip full test groups or individual assertions with `t.skip()`
* Only run selected test group(s) with `t.only()`
* Basic test runner to run multiple files and directories
* Single function, no methods, nothing to learn, nothing to remember
* Basic coloring of errors
* Compact reporting
* Support only running selected tests for troubleshooting
* No dependencies, under 200 SLOC

## Limitations

* Node only (not for browsers)
* No nesting of tests
* Limited configuration

# How

## Installation

In node, from the project root folder type `npm i -D cotest` to install.

## API

### Command Line
* `cotest file1 directory1 directory2 file2 ...`

### Test Declaration
* `cotest(titleString[, testFunction [, message]])`
* `cotest.skip(titleString[, testFunction [, message]])`
* `cotest.only(titleString, testFunction [, message])`

if no test function is provided, the test will be marked as skipped

### Assertion Declaration
* `cotest(operator, valueToTest, referenceValue[, additional message])`
* `cotest.skip(operator, valueToTest, referenceValue[, additional message])`

### Async use

Test are normally automatically completed after the test function is executed.
Example: `cotest('syncTest', function() { /*assertions*/ })`

To change this behaviour, add a callback to the test function. This calback must be called to end the test.
Example: `cotest('asyncTest', function(done) { /*assertions*/; done()})`

If a callback is declared but not called, the test fails after 250ms.
To change the default duration: `cotest.timeout(500)`

## Use in a test file

```javascript
  var co = require('cotest')
  co('async test, call the function argument to end' function(done) {
    co('<', Math.abs(error), 0.001)
    setTimeout(done, 0)
  })
  co('sync test - no function argument needed' function() {
    co('==', 1+1, 2)
    co('!', null)
    co('{==}', [1, 2], [1, 2])
  }, 'Any Truthy Value as 3rd argument will only run flagges tests')
  co('sync test - no function argument needed' function() {
    co('==', 1+1, 2)
    co('{==}', [1, 2], [1, 2])
  })
```

## Use in `package.json`

```json
"scripts": {
  "test": "cotest mytestdirectory",
  "test_file": "cotest mytestdirectory/mytestfile"
}
```

In any of the test files are flagged as priority, only these tests will run.

# License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
