<!-- markdownlint-disable MD004 MD007 MD010 MD041 MD022 MD024 MD032 -->
# cotest

*yet another unit test assertion and test runner* -
***small, simple, no dependencies***

![ScreenCap](./cotest.gif)

• [Why](#why) • [What](#what) • [How](#how) • [License](#license) •

# Why

This originated as an attempt to have assertions that are less verbose because `assert.notDeepStrictEqual` is ugly.

# What

## Example

```javascript
const ct = require('cotest')

ct('1. primitives - comparison', function(t) {
  t('==', 2, 2)
  t('!==', 3, 4, 'should be unequal')
  t('<', 1, 2)
  t('!', null, 'should be falsy')
  t.skip('>=', 55, 0, 'TODO')
})
ct('2. object - comparison', function(t) {
  t('!{===}', [], 'str', 'should be notDeepStrictEqual')
  t('{==}', [2], 2, 'should be deepEqual')
})
ct('3. async', function(t, end) {
  setTimeout(end, 0)
  t('!==', 3, 4)
  t('!{==}', 3, 4)
})
ct.skip('4. skip', function(t) {
  // all tests defined here will be skipped
})
```

## Features

* Javascript Comparison Operators (`==`, `!==`, `===`, `!===`, `<`, `<=`, `>`, `>=`)
* Negation (`!`, `!!`)
* Other symbols for nested object
  * `{==}`: deepEqual
  * `!{==}`: notDeepEqual
  * `{===}`: strictDeepEqual
  * `!{===}`: notStrictDeepEqual
* `throws` for assert.throws, `!throws` for doesNotThrows
* Async support
* Skip full test groups or individual assertions with `t.skip()`
* Only run selected test group(s) with `t.only()`
* Basic test runner to run multiple files and directories
* Compact reporting
* Support only running selected tests for troubleshooting

## Limitations

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
* `assert(operator, valueToTest, referenceValue[, additional message])`
* `assert.skip(operator, valueToTest, referenceValue[, additional message])`

### Async use

Test are normally automatically completed after the test function is executed.
Example: `cotest('syncTest', function(assert) { /*assertions*/ })`

To change this behaviour, add a callback to the test function. This calback must be called to end the test.
Example: `cotest('asyncTest', function(assert, done) { /*assertions*/; done()})`

An error message can be passed to the `done`function.
Example: `cotest('asyncTest', function(assert, done) { if (true) done() else done('failed') })`

If a callback is declared but not called, the test fails after 1000ms.
To change the default duration: `cotest.timeout = 1500`

## Use in a test file

```javascript
	var co = require('cotest')
	co('async test, call the function argument to end', function(t, done) {
		t('<', Math.abs(error), 0.001)
		setTimeout(done, 0)
	})
	co('sync test - no function argument needed', function(t) {
		t('==', 1+1, 2)
		t('!', null)
		t('{==}', [1, 2], [1, 2])
	}, 'Any Truthy Value as 3rd argument will only run flagges tests')
	co('sync test - no function argument needed', function(t) {
		t('==', 1+1, 2)
		t('{==}', [1, 2], [1, 2])
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
