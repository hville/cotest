/* eslint eqeqeq: 0, no-console: 0*/
'use strict'
/**
 * Inspired and modified from https://www.npmjs.com/package/tt and https://www.npmjs.com/package/untap
 */

var assert = require('assert')

var tests = [],
		countT = {
			done: 0,
			skip: 0
		},
		countA = {
			pass: 0,
			fail: 0,
			skip: 0
		}

var flags = false,
		currentMode = init, // --> push --> test
		maxtime = 250,
		active = {}

// color format and fixed text
var NORM = '\u001b[0m',
		RED = '\u001b[31m',
		RET = '\n',
		tab1 = '  ',
		tab2 = '    '

var ops = {

	'{==}' : function(v,r,m) { assert.deepEqual(v, r, message(v, '{==}', r, m)) },
	'{===}': function(v,r,m) { assert.deepStrictEqual(v, r, message(v, '{===}', r, m)) },
	'!{==}': function(v,r,m) { assert.notDeepEqual(v, r, message(v, '!{==}', r, m)) },
	'!{===}': function(v,r,m) { assert.notDeepStrictEqual(v, r, message(v, '!{===}', r, m)) },
	'==' : function(v,r,m) { assert.equal(v, r, message(v, '==', r, m)) },
	'===' : function(v,r,m) { assert.strictEqual(v, r, message(v, '===', r, m)) },
	'!=' : function(v,r,m) { assert.notEqual(v, r, message(v, '!=', r, m)) },
	'!==' : function(v,r,m) { assert.notStrictEqual(v, r, message(v, '!==', r, m)) },

	'>' : function(v,r,m) { assert.equal(v > r, true, message(v, '>', r, m)) },
	'<' : function(v,r,m) { assert.equal(v < r, true, message(v, '<', r, m)) },
	'>=' : function(v,r,m) { assert.equal(v >= r, true, message(v, '>=', r, m)) },
	'<=' : function(v,r,m) { assert.equal(v <= r, true, message(v, '<=', r, m)) },

	'!>' : function(v,r,m) { assert.equal(v > r, false, message(v, '!>', r, m)) },
	'!<' : function(v,r,m) { assert.equal(v < r, false, message(v, '!<', r, m)) },
	'!>=' : function(v,r,m) { assert.equal(v >= r, false, message(v, '!>=', r, m)) },
	'!<=' : function(v,r,m) { assert.equal(v <= r, false, message(v, '!<=', r, m)) },

	'!' : function(v,m) { assert(!v, message('', '!', v, m)) },
	'!!' : function(v,m) { assert(!!v, message('', '!!', v, m)) },

	'catch' : function(b,e,m) { assert.throws(b, e, m) }
}
function message(val, opr, ref, msg) {
	var txt = val + ' ' + opr + ' ' + ref
	return msg === undefined ? txt : txt + ', ' + msg
}

module.exports = miniTest

/**
 * Single test function to either declare a test or an assertion
 * @param {string} text test name or operator
 * @param {*} [fcnORval] test function or test value
 * @param {*} [onlyORref] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
function miniTest(text, fcnORval, onlyORref, msg) {
	currentMode(text, fcnORval, onlyORref, msg)
}
miniTest.timeout = function(ms) {
	maxtime = ms
}
/**
 * @param {string} text test name or operator
 * @param {*} fcnORval test function or test value
 * @param {*} [onlyORref] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
miniTest.skip = function skip(text, fcnORval, onlyORref, msg) {
	currentMode.skip(text, fcnORval, onlyORref, msg)
}
/**
 * @param {string} text test name or operator
 * @param {*} fcnORval test function or test value
 * @param {*} [onlyORref] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
miniTest.only = function only(text, fcnORval, onlyORref, msg) {
	currentMode.only(text, fcnORval, onlyORref, msg)
}
/**
 * @param {string} name test name
 * @param {*} fcn test function
 * @param {*} [only] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
function init(name, fcn, only, msg) {
	push(name, fcn, only, msg)
	currentMode = push
	setTimeout(exec, 0)
}
/**
 * @param {string} name test name
 * @param {*} fcn test function
 * @param {*} [only] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
init.only = function(name, fcn, only, msg) {
	push.only(name, fcn, only, msg)
	currentMode = push
	setTimeout(exec, 0)
}
/**
 * @param {string} name test name
 * @param {*} fcn test function
 * @param {*} [only] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
init.skip = function(name, fcn, only, msg) { //eslint-disable-line no-unused-vars
	currentMode = push
	setTimeout(exec, 0)
}

/**
 * add every asserting function to the list of tests
 * @param {string} name test name
 * @param {*} fcn test function
 * @param {*} [only] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
function push(name, fcn, only, msg) {
	if (isMessage(only)) {
		msg = only
		only = undefined
	}
	tests.push({
		head: tab1 + name + ' [',
		test: fcn,
		text: msg ? tab1 +msg + RET : '',
		flag: fcn ? only : false
	})
	// if any test is flagged, non-flagged tests will be skipped
	if (only && !flags) flags = true
}

/**
 * @param {string} name test name
 * @param {*} fcn test function
 * @param {*} [only] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
push.only = function pushOnly(name, fcn, only, msg) {
	if (isMessage(only)) push(name, fcn, true, only)
	else push(name, fcn, true, msg)
}

/**
 * @param {string} name test name
 * @param {*} fcn test function
 * @param {*} [only] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
push.skip = function pushSkip(name, fcn, only, msg) {
	if (isMessage(only)) push(name, fcn, false, only)
	else push(name, fcn, false, msg)
}

/**
 * @param {string} op test operator
 * @param {*} val test value
 * @param {*} [ref] reference value
 * @param {*} [msg] message
 * @return {void}
 */
function test(op, val, ref, msg) {
	if (op === 'skip') {
		countA.skip++
		active.head += 's'
		return
	}
	if (!ops[op]) throw Error('first assertion parameter must be a valid operation string')
	try {
		ops[op](val, ref, msg)
		countA.pass++
		active.head += '.'
	} catch (e) {
		countA.fail++
		active.head += RED + 'x' + NORM
		Error.captureStackTrace(e, miniTest)
		formatErrorStack(e)
	}
}
test.skip = function testSkip(name, fcn, only, msg) {
	test('skip', fcn, only, msg)
}
test.only = function testOnly(op, val, ref, msg) {
	test(op, val, ref, msg)
}

function formatErrorStack(e) {
	// ignore everything up to the run() function in last 3 lines
	var lst = !e.stack ? [] : e.stack.split(/\n/).slice(0,-3).map(trim)
	if (lst.length && !e.message) e.message = lst[0]
	active.text += RET + RED + tab2 + (lst.length ? lst.shift() : e.message) + NORM
	if (lst.length) active.text += RET + tab2 + lst.join('\n' + tab2) + RET
}
function trim(str) {
	return str.trim()
}
// close the assertion entries and perform pre-run ops
function exec() {
	currentMode = test
	console.log('\n\n=== cotest ===')
	process.nextTick(run)
}
// perform every tests
function run() {
	if (!tests.length) return done()
	active = tests.shift()
	// skipped test with 'false' flag ... if any test is flagged, ignore all unflagged tests
	if (active.flag === false || (flags && !active.flag)) {
		active.head += 'SKIP'
		countT.skip++
		log()
	}
	else if (!active.test.length) {
		active.test(log)
		countT.done++
		log()
	}
	else {
		setTimeout(timeout, maxtime)
		active.test(log)
	}
}
function timeout() {
	countA.fail++
	active.head += RED + 'T' + NORM
	log()
}
function log() {
	console.log(RET + active.head + ']')
	if (active.text) console.log(RED + active.text + NORM)
	process.nextTick(run)
}
function done() {
	var sum = countA.pass + countA.fail + countA.skip

	console.log('\n===',
		'END OF ' + countT.done + (countT.done > 1 ? ' TESTS' : ' TEST'),
		countT.skip ? '('+countT.skip+' skipped)' : '==='
	)

	console.log(tab1+'pass '+countA.pass+'/'+sum)

	countA.fail ? console.log(tab1 + RED + 'fail %d/%d'+NORM, countA.fail, sum)
	: console.log(tab1 + 'fail 0/%d', sum)

	if (countA.skip) console.log(tab1 + RED + 'skip %d/%d'+NORM, countA.skip, sum)

	process.exit(countA.fail)
}

function isMessage(msg) {
	var typ = typeof msg
	return typ === 'string' || typ === 'number'
}
